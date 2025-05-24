const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'skillsdb',
  password: 'chomandu99',
  port: 5432,
})

module.exports = pool;
