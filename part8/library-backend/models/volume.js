const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Writer'
  },
  genres: [
    { type: String }
  ]
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Volume', schema)