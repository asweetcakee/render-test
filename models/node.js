require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
  .replace('<USERNAME>', process.env.MONGODB_USERNAME)
  .replace('<PASSWORD>', process.env.MONGODB_PASSWORD)
console.log('connecting to', url)

mongoose.connect(url).then(result => {
  console.log('Connected to MongoDB')
})
.catch(error => {
  console.error('error connecting to MongoDB:', error.message)
})

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
