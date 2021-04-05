const User = require("../../models/user.js")
const bcrypt=require("bcrypt");
exports.Postlogin=(req,res,next)=>{
    const date=new Date();
    const newUser=new User({
        name:"ali",
        email:"ali@gmail.com",
        password:"12345",
        datecreate:date,
        dept:"medical",
        mobile:"034562727323",
        dob:"heelo",
        gender:"male",
        user_role:0
    })
    bcrypt.genSalt(10,(err,salt)=> 
    bcrypt.hash(newUser.password,salt,
        (err,hash)=> {
           
            if(err) throw err;
            newUser.password = hash;
            console.log(newUser);
          newUser.save().then((result)=>{
           console.log(result,"inserted llllllllllllllllllllllllllll");
       }).catch((err)=>{
           console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrr");
       })
            
           
        }));

}