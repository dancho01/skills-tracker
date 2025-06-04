const express = require('express')
const router = express.Router()
const pool = require('../db')
const authenticateToken = require('../middleware/auth')


// POST - Log a new session for particular skill
router.post('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { duration, notes } = req.body
    const user_id = req.user.userId;
    const result = await pool.query('INSERT INTO sessions (user_id, skill_id, duration, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, id, duration, notes])
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// GET - get all sessions for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const result = await pool.query('SELECT * FROM sessions WHERE user_id = $1', [user_id])
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
  }
})

// GET - get all sessions for particular skill
router.get('/skill/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM sessions WHERE skill_id = $1', [id])
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
  }
})

// GET - Get session details 
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user.userId;
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1 AND user_id = $2', [id, user_id])

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Forbidden' }); 
    }
    
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// PUT - Update session
router.put('/:id', authenticateToken, async (req, res) => {
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
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM sessions WHERE id = $1', [id])
    res.json("Session deleted!")
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router;