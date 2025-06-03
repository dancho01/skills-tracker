const jwt = require('jsonwebtoken')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

authenticateToken = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.log(err.message)
      return res.sendStatus(403);
    } 
    req.user = payload;
    next();
  })
}

module.exports = authenticateToken;