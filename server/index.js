const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express()
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.json()) // parses JSON
app.use(cookieParser());

const skillRoutes = require('./routes/skills')
const sessionRoutes = require('./routes/sessions')
const statRoutes = require('./routes/stats')
const authRoutes = require('./routes/auth')

app.use('/skills', skillRoutes)
app.use('/sessions', sessionRoutes)
app.use('/stats', statRoutes)
app.use('/auth', authRoutes)

app.listen(5001, () => {
  console.log('Server is running on port 5001')
})