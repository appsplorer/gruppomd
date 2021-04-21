const mongoose = require('mongoose');
const patientSchema  = new mongoose.Schema({
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

address:{
    type:String,
    required:true
},
country:{
    type:String,
    required:true
},
city:{
    type:String,
    required:true
},
state:{
    type:String,
    required:true
},
blood:{
    type:String,
    required:true
},
profile_image:{
    type:String,
    required:true
}

});
const Patientprofile= mongoose.model('Patientprofile',patientSchema);

module.exports = Patientprofile;

//define('FORCE_SSL_ADMIN', true);