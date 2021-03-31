const mongoose = require('mongoose');
const AddslotSchema  = new mongoose.Schema({
    starttime :{
      type  : String,
      required : true
  } ,
  endtime :{
    type  : String,
    required : true
  } ,
  daychkval :{
    type  : String,
    required : true
  } ,

});
const AddSlot= mongoose.model('AddSlot',AddslotSchema);

module.exports = AddSlot;

//define('FORCE_SSL_ADMIN', true);