const express = require('express')
const router = express.Router()
const pool = require('../db')

// POST - Log a new session for particular skill
router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { duration, notes } = req.body
    const result = await pool.query('INSERT INTO sessions (user_id, skill_id, duration, notes) VALUES (1, $1, $2, $3) RETURNING *',
      [id, duration, notes])
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// GET - get all sessions for the user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sessions WHERE user_id = 1')
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
  }
})

// GET - get all sessions for particular skill
router.get('/skill/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM sessions WHERE skill_id = $1', [id])
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
  }
})

// GET - Get session details 
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [id])
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
  }
})

// PUT - Update session
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { duration, notes } = req.body
    await pool.query('UPDATE sessions SET duration = $1, notes = $2 WHERE id = $3', 
      [duration, notes, id])
    res.json("Session updated!")
  } catch (err) {
    console.log(err.message)
  }
})

// DELETE - delete session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM sessions WHERE id = $1', [id])
    res.json("Session deleted!")
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router;