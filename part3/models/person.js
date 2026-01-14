const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const dbUrl = process.env.MONGODB_URI

console.log('Connecting to database:', dbUrl)

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('Database connection successful')
  })
  .catch((err) => {
    console.log('Database connection failed:', err.message)
  })

const validatePhone = (phone) => {
  const regex = /^\d{2,3}-\d+$/
  return regex.test(phone)
}

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name too short'],
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minLength: [8, 'Number too short'],
    required: true,
    validate: [validatePhone, 'Invalid phone number format'],
  },
})

entrySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('PhonebookEntry', entrySchema)
