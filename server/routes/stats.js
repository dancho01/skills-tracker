const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET - total time practiced for skill
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM sessions WHERE skill_id = $1', [id])
    let total = 0 
    for (const session of result.rows) {
      total += session.duration;
    }
    res.json(total)

  } catch (err) {
    console.log(err.message)
  }
})

// GET - sessions in last 7 days, most recent sessions


module.exports = router;