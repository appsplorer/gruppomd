var express = require('express');
var router = express.Router();
const User = require("../models/user.js")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//login handle
router.get('/login',(req,res)=>{
  res.render('login');
})
router.get('/register',(req,res)=>{
  res.render('register')
  })
//Register handle
router.post('/register',(req,res)=>{
  const {name,email, password, password2,} = req.body;
  let errors = [];
  console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
  if(!name || !email || !password || !password2) {
      errors.push({msg : "Please fill in all fields"})
  }
  //check if match
  if(password !== password2) {
      errors.push({msg : "passwords dont match"});
  }
  
  //check if password is more than 6 characters
  if(password.length < 6 ) {
      errors.push({msg : 'password atleast 6 characters'})
  }
  if(errors.length > 0 ) {
  res.render('register', {
      errors : errors,
      name : name,
      email : email,
      password : password,
      password2 : password2})
   } else {
      //validation passed
     User.findOne({email : email}).exec((err,user)=>{
      console.log(user);   
      if(user) {
          errors.push({msg: 'email already registered'});
          res.render('register',{errors,name,email,password,password2})  
         } else {
          let date_now = new Date();
          const newUser = new User({
              name : name,
              email : email,
              password:password,
              datecreate:date_now,
              dept:dept,
              mobile:mobile,
              dob:dob,
              gender:gender,
              user_role:1
              
          });
  
          //hash password
          bcrypt.genSalt(10,(err,salt)=> 
          bcrypt.hash(newUser.password,salt,
              (err,hash)=> {
                  if(err) throw err;
                      //save pass to hash
                      newUser.password = hash;
                  //save user
                  newUser.save()
                  .then((value)=>{
                      console.log(value)
                  res.redirect('/users/login');
                  })
                  .catch(value=> console.log(value));
                    
              }));
           }
     })
  }
  });


router.post('/login',(req,res,next)=>{
    
})

//logout
router.get('/logout',(req,res)=>{
})

module.exports = router;
