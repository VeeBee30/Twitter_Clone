const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    name:{
        type:String
    },
    username:{
        type: String,
        
    },
   
    password:{
        type:String,
        
    },
    
    date: {
        type: Date,
        default : Date.now
    },
    userimage: {
        type:String,
        default:"https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
    }
  });
  module.exports = mongoose.model('user',UserSchema)