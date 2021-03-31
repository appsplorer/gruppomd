const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    required : true
} ,
mobile :{
    type  : String,
    required : true
} ,
password :{
    type  : String,
    required : true
} ,
datecreate :{
    type : Date,
    default : Date.now
},
gender :{
    type  : String,
    required : true
},
dob :{
    type  : String,
    required : true
},
dept :{
    type  : String,
    required : true
},
user_role:{
    type:String,
    required:true
}
});
const User= mongoose.model('User',UserSchema);

module.exports = User;

//define('FORCE_SSL_ADMIN', true);