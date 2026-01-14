const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()
const Account = require('../models/account')

accountsRouter.get('/', async (req, res) => {
  const accounts = await Account
    .find({})
    .populate('posts', { title: 1, author: 1, url: 1 })

  res.json(accounts)
})

accountsRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newAccount = new Account({
    username,
    name,
    passwordHash
  })

  const savedAccount = await newAccount.save()

  res.status(201).json(savedAccount)
})

module.exports = accountsRouter
