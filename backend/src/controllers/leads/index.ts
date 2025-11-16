import { Router } from 'express'
import { getDb } from '../../db'
import { authMiddleware, AuthRequest } from '../../middlewares'

const router = Router()
const db = getDb()

// Protect all leads routes
router.use(authMiddleware)

// GET /api/leads - list leads with pagination
router.get('/', (req, res) => {
  const page = Number(req.query.page ?? 1)
  const pageSize = Number(req.query.pageSize ?? 10)

  if (Number.isNaN(page) || page < 1 || Number.isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
    return res.status(400).json({ error: 'Invalid pagination parameters' })
  }

  const offset = (page - 1) * pageSize

  try {
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM leads')
    const { total } = countStmt.get() as { total: number }

    const stmt = db.prepare(
      'SELECT * FROM leads ORDER BY id DESC LIMIT ? OFFSET ?',
    )
    const leads = stmt.all(pageSize, offset)

    const totalPages = Math.ceil(total / pageSize) || 1

    return res.json({
      data: leads,
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
    const stmt = db.prepare('SELECT * FROM leads WHERE id = ?')
    const lead = stmt.get(id)

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    return res.json(lead)
  } catch (err) {
    console.error('[leads] Error fetching lead:', err)
    return res.status(500).json({ error: 'Failed to fetch lead' })
  }
})

// POST /api/leads - create a lead
router.post('/', (req: AuthRequest, res) => {
  const { name, email, companyId } = req.body as {
    name?: string
    email?: string
    companyId?: number | null
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' })
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO leads (name, email, company_id) VALUES (?, ?, ?)',
    )
    const result = stmt.run(name, email, companyId ?? null)

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

  const { name, email, companyId } = req.body as {
    name?: string
    email?: string
    companyId?: number | null
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' })
  }

  try {
    const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    const stmt = db.prepare(
      'UPDATE leads SET name = ?, email = ?, company_id = ? WHERE id = ?',
    )
    stmt.run(name, email, companyId ?? null, id)

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


