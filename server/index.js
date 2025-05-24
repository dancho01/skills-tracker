const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors()) // clients from diff ports has access
app.use(express.json()) // parses JSON

const skillRoutes = require('./routes/skills')
const sessionRoutes = require('./routes/sessions')

app.use('/skills', skillRoutes)
app.use('/sessions', sessionRoutes)

app.listen(5001, () => {
  console.log('Server is running on port 5001')
})