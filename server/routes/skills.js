const express = require('express')
const router = express.Router()
const pool = require('../db')
const authenticateToken = require('../middleware/auth')

// GET - get all skills for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const id = req.user.userId;
    const result = await pool.query('SELECT * FROM skills WHERE user_id = $1', [id]);
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
  }
})

// POST - add new skill
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { skill, level } = req.body
    const id = req.user.userId;
    const result = await pool.query('INSERT INTO skills (user_id, skill, level) VALUES ($1, $2, $3) RETURNING *', [id, skill, level])
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// GET - get details for a particualr skill
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user.userId;
    const result = await pool.query('SELECT * FROM skills WHERE id = $1 AND user_id = $2', [id, user_id]);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Forbidden' }); 
    }
  
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// PUT - update skill level
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { level } = req.body
    await pool.query('UPDATE skills SET level = $1 WHERE id = $2', [level, id]);
    res.json('Updated!')
  } catch (err) {
    console.log(err.message)
  }
})

// DELETE - delete skill
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json('Deleted!')
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router;