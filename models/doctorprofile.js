const mongoose = require('mongoose');
const DoctorSchema  = new mongoose.Schema({
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
dept :{
    type  : String,
    required : true
},
biography:{
    type:String,
    required:true
},
clinic_name:{
    type:String,
    required:true
},
clinic_address:{
    type:String,
    required:true
},
clinic_image:{
    type:String,
    required:true
},
address_one:{
    type:String,
    required:true
},
address_two:{
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
province:{
    type:String,
    required:true
},
post_code:{
    type:String,
    required:true
},
pricing_type:{
    type:String,
    required:true
},
services:{
    type:String,
    required:true
},
specialization:{
    type:String,
    required:true
},
profile_image:{
    type:String,
    required:true
}

});
const Doctorprofile= mongoose.model('Doctorprofile',DoctorSchema);

module.exports = Doctorprofile;

//define('FORCE_SSL_ADMIN', true);