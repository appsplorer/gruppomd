var express = require('express');
var router = express.Router(); 
const User = require("../models/user.js");
const Doctorprofile = require("../models/doctorprofile.js");
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const {ensureAuthenticated} = require('../config/auth') 
var multer  = require('multer');
const upload = multer({ dest: 'uploads/'});
/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('doctors/index', { title: 'Home' });
});

router.get('/register', function(req, res, next) {  
  res.render('doctors/register', { title: 'Register' });
});

router.get('/about-us', function(req, res, next) {  
  res.render('doctors/about-us', { title: 'About us' });
});

router.get('/contact-us',function(req,res,next){
  res.render('doctors/contact-us', { title: 'Contact us' });
});

router.get('/blog',function(req,res,next){
res.render('doctors/blog',{title:'Blog',userdata:req.user});

});

router.get('/login',function(req,res,next){
  res.render('doctors/login',{title:'Login'});
  
  });
  router.get('/forgot-password',function(req,res,next){
    res.render('doctors/forgot-password',{title:'Forgot password',userdata:req.user});
    
    });

router.get('/dashboard-doctor',function(req,res,next){
      res.render('doctors/mydash',{title:'Doctor Dashboard',userdata:req.user});
    });

router.get('/my-appointments',function(req,res,next){
      res.render('doctors/appointments',{title:'Doctor Dashboard',userdata:req.user});
    });  
    
router.get('/my-patients',function(req,res,next){
      res.render('doctors/patients',{title:'Doctor Dashboard',userdata:req.user});
    }); 
    
    
router.get('/schedule-timing',function(req,res,next){
    
      var slotdata=AddSlots.find({});
      slotdata.exec(function(err,data){
        if(err) throw err;
        res.render('doctors/schedule-timing',{title:'Doctor Dashboard',userdata:req.user,records:data});
      });
    
        
});  
router.get('/invoices',function(req,res,next){
    
  res.render('doctors/invoices',{title:'Doctor Dashboard',userdata:req.user});
    
    }); 

router.get('/reviews',function(req,res,next){
    
  res.render('doctors/reviews',ensureAuthenticated,{title:'Doctor Dashboard',userdata:req.user});
    
    });

router.get('/message',function(req,res,next){
    
  res.render('doctors/message',{title:'Doctor Dashboard',userdata:req.user});
    
}); 
router.get('/profile-setting',ensureAuthenticated,function(req,res,next){
    //
    Doctorprofile.findOne({email : req.user.email}).exec((err,user)=>{
      console.log(user);
      if(!err){
        res.render('doctors/profile-setting',{profileData:user,res:res,title:'Doctor Dashboard',userdata:req.user});
    
      }

    })
  
}); 
router.get('/social-media',ensureAuthenticated,function(req,res,next){
    
  res.render('doctors/social-media',{title:'Doctor Dashboard',userdata:req.user});
    
}); 
router.get('/change-password',ensureAuthenticated,function(req,res,next){
    
  res.render('doctors/change-password',{title:'Doctor Dashboard',userdata:req.user});
    
}); 

router.post('/usersregister',(req,res)=>{
  const {name,email, password, password2,} = req.body;
  //console.log(req.body.name);
  //return false;
  let errors = [];
  //console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
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
  res.render('', {
      errors : errors,
      name : name,
      email : email,
      password : password,
      password2 : password2})
   } else {
      //validation passed
     User.findOne({email : email}).exec((err,user)=>{
      console.log("No data in table like this");   
      if(user) {
          errors.push({msg: 'email already registered'});
          res.render('/register',{errors,name,email,password,password2})  
         } 
         else {
          let date_now = new Date();
          const newUser = new User({
              name : name,
              email : email,
              password:password,
              datecreate:date_now,
              dept:req.body.dept,
              mobile:req.body.mobile,
              dob:req.body.dob,
              gender:req.body.gender,
              user_role:1
              
          });

          bcrypt.genSalt(10,(err,salt)=> 
          bcrypt.hash(newUser.password,salt,
              (err,hash)=> {
                  if(err) throw err;
                      //save pass to hash
                      newUser.password = hash;
                  //save user
                  newUser.save()
                  .then((value)=>{
                    req.flash('success_msg','You have now registered!');
                    res.redirect('/login');
                      //console.log(value)
                  //res.redirect('/login');
                  })
                  .catch(value=> console.log('Not  item saved into  db'));
                    
              }));

     /*   if(newUser.save()){ 
          //res.redirect('/login?value=Successfully done!'); 
         
          req.flash('success_msg','You have now registered!');
          res.redirect('/login');
          //res.render('doctors/register',{success:'Successfully Regsitered'}); 
         // res.send("item saved to database");
          //console.log('great'+newUser);
          //hash password
        } else{
          console.log('Not  item saved into  db');
        }  */

        /*  bcrypt.genSalt(10,(err,salt)=> 
          bcrypt.hash(newUser.password,salt,
              (err,hash)=> {
                  if(err) throw err;
                      //save pass to hash
                      newUser.password = hash;
                  //save user
                  newUser.save()
                  .then((value)=>{
                      console.log(value)
                  //res.redirect('/login');
                  })
                  .catch(value=> console.log(value));
                    
              }));*/
           }
     })
  }
  }); 


  router.post('/change-doc-password',(req,res)=>{  


    bcrypt.compare(req.body.password, req.user.password, (err, match) => {
     
      if (match){
          bcrypt.hash(req.body.password, salt, function (er, hash) {
            User.findOneAndUpdate(req.user.id, req.hash, function (err, profile) {

              //res.send('Password Updated!!');
              res.redirect('/login');
            });
              //db.query("UPDATE users SET password=? WHERE id=?", [hash, user.id], callback);
          });
      }else {
        // that's not good, send an error to the caller
        var err = new Error('Password does not match');
        err.code = 'BAD_PASSWORD';
        callback(err);
      }
  });


    //const {password_confirmation,password} = req.body;

  });

  router.post('/comparePassword',(req,res)=>{  


    const {givenpassword} = req.body;
    //res.send('hi'+givenpassword);

    bcrypt.compare(givenpassword,req.user.password,(err,match) => {
      
      if (match){
        res.send('hi its ookkk');
          //bcrypt.hash(req.body.password, saltRounds, function (er, hash) {
             // if (er) return callback(er); // and this one!!
              
        //  });
      }else {
      
        
      }
  });

  });

router.post('/save-profile',upload.single('clinic_image'),(req,res)=>{  


  const {name,email} = req.body;
 // console.log(req.body.name);
  //console.log(req.body.email);
  //console.log(name);
  //return false;
  let errors = [];
  //console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
  if(!email) {
      errors.push({msg : "Please fill in all fields"})
  }

      //validation passed
      let date_nowt = new Date();
      const profileUser = new Doctorprofile({
          name : name,
          email : email,
          datecreate:date_nowt,
          dept:req.body.dept,
          mobile:req.body.mobile,
          dob:req.body.dob,
          gender:req.body.gender,
          biography : req.body.biography,
          clinic_name : req.body.clinic_name,
          clinic_address:req.body.clinic_address,
          clinic_image:req.body.clinic_image,
          address_one:req.body.address_one,
          address_two:req.body.address_two,
          country:req.body.country,
          city:req.body.city,
          province:req.body.province,
          post_code:req.body.post_code,
          pricing_type:req.body.pricing_type,
          services:req.body.services,
          specialization:req.body.specialization,
          profile_image:req.body.profile_image,

      });
     // profileUser.save();
     // res.redirect('/profile-setting');
      Doctorprofile.findOne({email : email}).exec((err,user)=>{
       
      if(user){
        console.log("data is in table");  
         // errors.push({msg: 'email already registered'});
    Doctorprofile.findOneAndUpdate(req.body.id, req.body, function (err, profile) {
           
          res.redirect('/profile-setting');
          //res.send(profile);
        // res.render('/profile-setting',{errors,name,email,password,password2}) 
        });
           
      } else{
        console.log(req.body);
        if(profileUser.save()){
          console.log(req.body);
          res.redirect('/profile-setting');
        }
      } 
     
        })
      
      

});



router.post('/addslot', function(req, res, next) {  
  // res.send('hiii');
  //  console.log(req.body);
   var sttime = req.body.starttime;
   var edtime = req.body.endtime;
   var daychk = req.body.daychkval;
   sttime.forEach(function(element,index) {
     const num2 = edtime[index];
     console.log(element, num2);
     const newslots = new AddSlots({
        starttime:element,
        endtime:num2,
        daychkval:daychk
     });

     console.log(newslots);
     newslots.save()
     .then((value)=>{
       req.flash('success_msg','Data Add!');
       res.redirect('/schedule-timing');
     })
     .catch(value=> console.log('Not saved'));
     
  });
  
});

  router.post('/loginpost',(req,res,next)=>{
   // var sess=sess=req.session;
   // sess.email; // equivalent to $_SESSION['email'] in PHP.
   // sess.username; // equivalent to $_SESSION['username'] in PHP
    //res.send('we are chekcing')
    passport.authenticate('local',{
        successRedirect : '/profile-setting',
        failureRedirect : '/login',
        failureFlash : true,
        })(req,res,next);
})

//logout
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','Now logged out');
res.redirect('/login');
})
module.exports = router;
