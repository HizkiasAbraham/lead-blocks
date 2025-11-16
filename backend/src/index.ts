import express, { Request, Response } from 'express'
import cors from 'cors'
import { getDb } from './db'
import { loginHandler } from './auth'
import { leadsRouter } from './controllers/leads'
import { companiesRouter } from './controllers/companies'

const app = express()
const PORT = process.env.PORT || 3000

// Initialize DB (connection + schema)
getDb()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express backend!' })
})

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth
app.post('/api/login', loginHandler)

// Resource controllers
app.use('/api/leads', leadsRouter)
app.use('/api/companies', companiesRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

