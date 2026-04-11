import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['error', 'warn', 'info', 'http', 'debug'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  method: {
    type: String,
  },
  url: {
    type: String,
  },
  statusCode: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Log', logSchema)