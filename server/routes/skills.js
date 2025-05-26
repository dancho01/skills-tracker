const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET - get all skills for user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills WHERE user_id = 1');
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
  }
})

// POST - add new skill
router.post('/', async (req, res) => {
  try {
    const { skill } = req.body
    const result = await pool.query('INSERT INTO skills (user_id, skill) VALUES (1, $1) RETURNING *', [skill])
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// GET - get details for a particualr skill
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// PUT - update skill 
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { skill } = req.body
    await pool.query('UPDATE skills SET skill = $1 WHERE id = $2', [skill, id]);
    res.json('Updated!')
  } catch (err) {
    console.log(err.message)
  }
})

// DELETE - delete skill
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json('Deleted!')
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router;