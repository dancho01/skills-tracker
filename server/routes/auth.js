const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register a user
router.post('/register', async (req, res) => {
   


})


// Login a user
router.post('/login', async (req, res) => {



})


module.exports = router;