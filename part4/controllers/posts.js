const postsRouter = require('express').Router()
const Post = require('../models/post')
const { userExtractor } = require('../utils/middleware')

postsRouter.get('/', async (req, res) => {
  const posts = await Post
    .find({})
    .populate('user', { username: 1, name: 1 })
  res.json(posts)
})

postsRouter.post('/', userExtractor, async (req, res) => {
  const { user } = req

  if (!user) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }

  const { title, author, url, likes } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'Title or URL missing' })
  }

  const newPost = new Post({
    title,
    author,
    url,
    likes: likes ?? 0,
    user: user
  })

  const savedPost = await newPost.save()

  // Assuming Account model has 'posts' field now
  user.posts = user.posts.concat(savedPost._id)
  await user.save({ validateModifiedOnly: true })

  res.status(201).json(savedPost)
})

postsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true }
  ).populate('user', { username: 1, name: 1 })

  res.json(updatedPost)
})

postsRouter.delete('/:id', userExtractor, async (req, res) => {
  const { user } = req

  if (!user) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }

  const postToDelete = await Post.findById(req.params.id)

  if (postToDelete?.user.toString() === user._id.toString()) {
    await Post.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } else {
    res.status(401).json({ error: 'Unauthorized operation' })
  }

})

module.exports = postsRouter
