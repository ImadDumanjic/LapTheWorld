import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import groqRoutes from './routes/groqRoutes.js'
import liveTimingRoutes from './routes/liveTimingRoutes.js'
import guideRoutes from './routes/guideRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(express.json())

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/', (req, res) => {
  res.send('Welcome to the LapTheWorld API!')
})

app.use('/api/auth', authRoutes)
app.use('/api/admin-auth', adminAuthRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/groq', groqRoutes)
app.use('/api/live', liveTimingRoutes)
app.use('/api/guides', guideRoutes)

export default app
