import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import userRoutes from './routes/userRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors())
app.use(express.json())

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/', (req, res) => {
  res.send('Welcome to the LapTheWorld API!')
})

app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/users', userRoutes)

export default app
