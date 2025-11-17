import { Router } from 'express'
import { getDb } from '../../db'
import { authMiddleware, AuthRequest } from '../../middlewares'

const router = Router()
const db = getDb()

// Protect all leads routes
router.use(authMiddleware)

// GET /api/leads - list leads with pagination and optional status filter
router.get('/', (req, res) => {
  const page = Number(req.query.page ?? 1)
  const pageSize = Number(req.query.pageSize ?? 10)
  const status = req.query.status as string | undefined

  if (Number.isNaN(page) || page < 1 || Number.isNaN(pageSize) || pageSize < 1 || pageSize > 1000) {
    return res.status(400).json({ error: 'Invalid pagination parameters' })
  }

  const offset = (page - 1) * pageSize

  try {
    // Build WHERE clause for status filter
    const statusWhere = status ? 'WHERE l.status = ?' : ''

    // Count query with status filter
    const countQuery = status
      ? 'SELECT COUNT(*) as total FROM leads l WHERE l.status = ?'
      : 'SELECT COUNT(*) as total FROM leads'
    const countStmt = db.prepare(countQuery)
    const { total } = (status ? countStmt.get(status) : countStmt.get()) as { total: number }

    // Select query with status filter
    const selectQuery = `
      SELECT 
        l.id,
        l.name,
        l.email,
        l.company_id,
        l.status,
        l.created_at,
        c.id as company_id_full,
        c.name as company_name,
        c.description as company_description
      FROM leads l
      LEFT JOIN companies c ON l.company_id = c.id
      ${statusWhere}
      ORDER BY l.id DESC 
      LIMIT ? OFFSET ?
    `
    const stmt = db.prepare(selectQuery)
    const leads = status
      ? stmt.all(status, pageSize, offset)
      : stmt.all(pageSize, offset)

    // Transform the results to include company object
    const transformedLeads = leads.map((lead: any) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company_id: lead.company_id,
      status: lead.status || 'active',
      created_at: lead.created_at,
      company: lead.company_id_full
        ? {
            id: lead.company_id_full,
            name: lead.company_name,
            description: lead.company_description,
          }
        : null,
    }))

    const totalPages = Math.ceil(total / pageSize) || 1

    return res.json({
      data: transformedLeads,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    })
  } catch (err) {
    console.error('[leads] Error fetching leads:', err)
    return res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

// GET /api/leads/:id - get a single lead
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid lead id' })
  }

  try {
    const stmt = db.prepare(`
      SELECT 
        l.id,
        l.name,
        l.email,
        l.company_id,
        l.status,
        l.created_at,
        c.id as company_id_full,
        c.name as company_name,
        c.description as company_description
      FROM leads l
      LEFT JOIN companies c ON l.company_id = c.id
      WHERE l.id = ?
    `)
    const lead = stmt.get(id) as any

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    // Transform the result to include company object
    const transformedLead = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company_id: lead.company_id,
      status: lead.status || 'active',
      created_at: lead.created_at,
      company: lead.company_id_full
        ? {
            id: lead.company_id_full,
            name: lead.company_name,
            description: lead.company_description,
          }
        : null,
    }

    return res.json(transformedLead)
  } catch (err) {
    console.error('[leads] Error fetching lead:', err)
    return res.status(500).json({ error: 'Failed to fetch lead' })
  }
})

// POST /api/leads - create a lead
router.post('/', (req: AuthRequest, res) => {
  const { name, email, companyId, status } = req.body as {
    name?: string
    email?: string
    companyId?: number | null
    status?: string
  }

  if (!name || !email || !companyId || !status) {
    return res.status(400).json({ error: 'name, email, companyId, and status are required' })
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO leads (name, email, company_id, status) VALUES (?, ?, ?, ?)',
    )
    const result = stmt.run(name, email, companyId, status)

    const created = db
      .prepare('SELECT * FROM leads WHERE id = ?')
      .get(result.lastInsertRowid)

    return res.status(201).json(created)
  } catch (err: any) {
    console.error('[leads] Error creating lead:', err)
    // Handle foreign key constraint errors
    if (typeof err.message === 'string' && err.message.includes('FOREIGN KEY')) {
      return res.status(400).json({ error: 'Invalid companyId' })
    }
    return res.status(500).json({ error: 'Failed to create lead' })
  }
})

// PUT /api/leads/:id - update a lead
router.put('/:id', (req: AuthRequest, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid lead id' })
  }

  const { name, email, companyId, status } = req.body as {
    name?: string
    email?: string
    companyId?: number | null
    status?: string
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' })
  }

  try {
    const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as any
    if (!existing) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    const stmt = db.prepare(
      'UPDATE leads SET name = ?, email = ?, company_id = ?, status = ? WHERE id = ?',
    )
    stmt.run(name, email, companyId ?? null, status || existing.status || 'active', id)

    const updated = db.prepare('SELECT * FROM leads WHERE id = ?').get(id)

    return res.json(updated)
  } catch (err: any) {
    console.error('[leads] Error updating lead:', err)
    if (typeof err.message === 'string' && err.message.includes('FOREIGN KEY')) {
      return res.status(400).json({ error: 'Invalid companyId' })
    }
    return res.status(500).json({ error: 'Failed to update lead' })
  }
})

// DELETE /api/leads/:id - delete a lead
router.delete('/:id', (req: AuthRequest, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid lead id' })
  }

  try {
    const stmt = db.prepare('DELETE FROM leads WHERE id = ?')
    const result = stmt.run(id)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    return res.status(204).send()
  } catch (err) {
    console.error('[leads] Error deleting lead:', err)
    return res.status(500).json({ error: 'Failed to delete lead' })
  }
})

export const leadsRouter = router


