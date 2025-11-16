import { Router } from 'express'
import { getDb } from '../../db'
import { authMiddleware, AuthRequest } from '../../middlewares'

const router = Router()
const db = getDb()

// Protect all company routes
router.use(authMiddleware)

// GET /api/companies - list companies with pagination
router.get('/', (req, res) => {
  const page = Number(req.query.page ?? 1)
  const pageSize = Number(req.query.pageSize ?? 10)

  if (Number.isNaN(page) || page < 1 || Number.isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
    return res.status(400).json({ error: 'Invalid pagination parameters' })
  }

  const offset = (page - 1) * pageSize

  try {
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM companies')
    const { total } = countStmt.get() as { total: number }

    const stmt = db.prepare(
      'SELECT * FROM companies ORDER BY id DESC LIMIT ? OFFSET ?',
    )
    const companies = stmt.all(pageSize, offset)

    const totalPages = Math.ceil(total / pageSize) || 1

    return res.json({
      data: companies,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    })
  } catch (err) {
    console.error('[companies] Error fetching companies:', err)
    return res.status(500).json({ error: 'Failed to fetch companies' })
  }
})

// GET /api/companies/:id - get a single company
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid company id' })
  }

  try {
    const stmt = db.prepare('SELECT * FROM companies WHERE id = ?')
    const company = stmt.get(id)

    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }

    return res.json(company)
  } catch (err) {
    console.error('[companies] Error fetching company:', err)
    return res.status(500).json({ error: 'Failed to fetch company' })
  }
})

// POST /api/companies - create a company
router.post('/', (req: AuthRequest, res) => {
  const { name, domain, website } = req.body as {
    name?: string
    domain?: string | null
    website?: string | null
  }

  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO companies (name, domain, website) VALUES (?, ?, ?)',
    )
    const result = stmt.run(name, domain ?? null, website ?? null)

    const created = db
      .prepare('SELECT * FROM companies WHERE id = ?')
      .get(result.lastInsertRowid)

    return res.status(201).json(created)
  } catch (err) {
    console.error('[companies] Error creating company:', err)
    return res.status(500).json({ error: 'Failed to create company' })
  }
})

// PUT /api/companies/:id - update a company
router.put('/:id', (req: AuthRequest, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid company id' })
  }

  const { name, domain, website } = req.body as {
    name?: string
    domain?: string | null
    website?: string | null
  }

  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }

  try {
    const existing = db.prepare('SELECT * FROM companies WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Company not found' })
    }

    const stmt = db.prepare(
      'UPDATE companies SET name = ?, domain = ?, website = ? WHERE id = ?',
    )
    stmt.run(name, domain ?? null, website ?? null, id)

    const updated = db.prepare('SELECT * FROM companies WHERE id = ?').get(id)

    return res.json(updated)
  } catch (err) {
    console.error('[companies] Error updating company:', err)
    return res.status(500).json({ error: 'Failed to update company' })
  }
})

// DELETE /api/companies/:id - delete a company
router.delete('/:id', (req: AuthRequest, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid company id' })
  }

  try {
    const stmt = db.prepare('DELETE FROM companies WHERE id = ?')
    const result = stmt.run(id)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Company not found' })
    }

    return res.status(204).send()
  } catch (err) {
    console.error('[companies] Error deleting company:', err)
    return res.status(500).json({ error: 'Failed to delete company' })
  }
})

export const companiesRouter = router


