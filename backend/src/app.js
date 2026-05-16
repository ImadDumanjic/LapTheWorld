import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import groqRoutes from './routes/groqRoutes.js'
import liveTimingRoutes from './routes/liveTimingRoutes.js'
import guideRoutes from './routes/guideRoutes.js'

const app = express()

app.set('trust proxy', 1)

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS policy: origin ${origin} not allowed`))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())


app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

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
