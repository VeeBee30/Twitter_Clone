const mongoose = require('mongoose');
const { Schema } = mongoose;
const TweetSchema = new Schema({
    name: {
        type:String
    },
    username:{
        type: String,
        
    },
   
    description: {
        type: String,
        required: true,
      
    },
    
    date: {
        type:String
        
    },

  });
  module.exports = mongoose.model('tweets',TweetSchema)