const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Account = require('../models/account')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const account = await Account.findOne({ username })
  const passwordCorrect =
    account === null ? false : await bcrypt.compare(password, account.passwordHash)

  if (!(account && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: account.username,
    id: account._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60
  })

  res
    .status(200)
    .send({ token, username: account.username, name: account.name })
})

module.exports = loginRouter
