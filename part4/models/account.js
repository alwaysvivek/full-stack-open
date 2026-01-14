const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
})

accountSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  }
})

accountSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Account', accountSchema)
