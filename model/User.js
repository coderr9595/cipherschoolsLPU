const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  testCount: { 
    type: Number, 
    default: 1, 
  },
});

module.exports = mongoose.model('User', userSchema);
