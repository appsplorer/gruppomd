var express = require('express');
var router = express.Router(); 
const User = require("../models/user.js");
const Doctorprofile = require("../models/doctorprofile.js");
const Patientprofile = require("../models/patientprofile.js");
const AddSlots  = require("../models/addslot.js");
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const {ensureAuthenticated} = require('../config/auth') 
var multer  = require('multer');
var path = require('path')
//const upload = multer({ dest: 'public/uploads/'});
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage });
var uploadMultiple=upload.fields([{ name: 'profile_image', maxCount: 10 }, { name: 'clinic_image', maxCount: 10 }])

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('doctors/index', { title: 'Home' });
});

//Patients routes
router.get('/register-patient', function(req, res, next) {  
  res.render('patients/register-patient', { title: 'Register' });
});

router.get('/patient-profile-setting',ensureAuthenticated,function(req,res,next){
    
    Patientprofile.findOne({email : req.user.email}).exec((err,user)=>{
      console.log(user);
      if(!err){
        res.render('patients/patient-profile-setting',{profileData:user,res:res,title:'Patient Dashboard',userdata:req.user});
    
      }

    }) 
  
}); 

router.post('/patient-save-profile',upload.single('profile_image'),(req,res)=>{  

  
  // Init Upload
  console.log(req.file);
  if (!req.file) {
 
  } 
  else {
    console.log('file received'); 
  }

  //console.log("posted values"+req.body);

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
      //var profile_image='3';
      let date_nowt = new Date();
      const profileUser = new Patientprofile({
          name : name,
          email : email,
          datecreate:date_nowt,
          mobile:req.body.mobile,
          dob:req.body.dob,
          gender:req.body.gender,
          address:req.body.address,
          country:req.body.country,
          city:req.body.city,
          state:req.body.state,
          province:req.body.province,
          post_code:req.body.post_code,
          profile_image:req.file.originalname,
          blood:req.body.blood
        

      });
     // profileUser.save();
     // res.redirect('/profile-setting');
      Patientprofile.findOne({email : email}).exec((err,user)=>{
       
      if(user){
        console.log("data is in table");  
         // errors.push({msg: 'email already registered'});
    Patientprofile.findOneAndUpdate(req.body.id, req.body, function (err, profile) {
           
          res.redirect('/patient-profile-setting');
          //res.send(profile);
        // res.render('/profile-setting',{errors,name,email,password,password2}) 
        });
           
      } else{
        //console.log(req.body);
        if(profileUser.save()){
          console.log(req.body);
          res.redirect('/patient-profile-setting');
        }
      } 
     
        })
      
      

});




router.get('/favourites', function(req, res, next) {  
  res.render('patients/favourites', { title: 'Register' });
});

router.get('/my-dependents', function(req, res, next) {  
  res.render('patients/my-dependents', { title: 'Register' });
});

router.get('/search-doctors', function(req, res, next) { 
 
   Doctorprofile.find({}, function(err, doctors) {
    
    res.render('doctors/search-doctors', {doctors:doctors, title: 'Search Doctors' });
           
        });
  
});

router.get('/doctor-detail/:id?', function(req, res, next) {  
  var id=req.params.id;
  console.log(id)
  Doctorprofile.findOne({_id : id}).exec((err,doctor)=>{
  res.render('doctors/doctor-detail', {doctor:doctor,title: 'Doctor Detail' });
  });
});

//Doctor routes
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
  if(req.body.user_role=='1'){
    dept=req.body.dept;
  }else{
    dept='0';
  }
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
              dept:dept,
              mobile:req.body.mobile,
              dob:req.body.dob,
              gender:req.body.gender,
              user_role:req.body.user_role
              
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
                  //.catch(value=> console.log('Not  item saved into  db'));
                    
              }));

   

           }
     })
  }
  }); 


  router.post('/change-doc-password',(req,res)=>{  
     console.log("User already pas: "+req.user.password)
     console.log("User New pas: "+req.body.password)

    //bcrypt.compare(req.body.password, req.user.password, (err, match) => {
     
      //if (match){
        console.log('Pas matched!!')
        bcrypt.genSalt(10,(err,salt)=> 
        bcrypt.hash(req.body.password,salt,
            (err,hash)=> {
                if(err) throw err;
               
                   

                      //res.send('Password Updated!!');
                     
               //User.findOneAndUpdate(req.user.id, req.hash, function (err, profile){  })
     User.findOneAndUpdate({ _id: req.user.id }, { $set: { password: hash } }, { new: true }, function(err, doc) { })

             
                .then((value)=>{
                  req.flash('success_msg','You have now registered!');
                 // res.redirect('/login');
                    console.log('Password changed!');
                res.redirect('/login');
                })
                .catch(value=> console.log('Not  item saved into  db'));
                  
            }));

        /*
        bcrypt.hash(req.body.password, salt, function (er, hash) {
            User.findOneAndUpdate(req.user.id, req.hash, function (err, profile) {

              res.send('Password Updated!!');
             
            });
             
          });   */
     // }
      //else {  }
      

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

router.post('/save-profile',uploadMultiple,(req,res)=>{  
//,upload.single('clinic_image'),
//upload.single('clinic_image');
//upload.single('profile_image');
  const {name,email} = req.body;
 if(req.files){
        console.log(req.files.profile_image[0].originalname)
         console.log(req.files.clinic_image[0].originalname)

        console.log("files uploaded")
    }

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
          clinic_image:req.files.clinic_image[0].originalname,
          address_one:req.body.address_one,
          address_two:req.body.address_two,
          country:req.body.country,
          city:req.body.city,
          province:req.body.province,
          post_code:req.body.post_code,
          pricing_type:req.body.pricing_type,
          services:req.body.services,
          specialization:req.body.specialization,
          profile_image:req.files.profile_image[0].originalname,
          degree:req.body.degree.toString(),
          college:req.body.college.toString(),
          complete_year:req.body.complete_year.toString(),
          hospital_name:req.body.hospital_name.toString(),
          from_appoint:req.body.from_appoint.toString(),
          to_appoint:req.body.to_appoint.toString(),
          designation:req.body.designation.toString(),
          awards:req.body.awards.toString(),
          awardsyear:req.body.awardsyear.toString(),
          memberships:req.body.memberships.toString(),
          registrations:req.body.registrations.toString(),
          registrationyear:req.body.registrationyear.toString()



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

router.get('/shwtimeslot',(req,res)=>{
  var daychk=req.query.chkval;
    // console.log(daychk);
    var slotdata=AddSlots.find({daychkval:daychk});
    slotdata.exec(function(err,data){
      if(err) throw err;
      res.render('dynamicpages/dynamicshwtimeslot',{records:data});
    });
  })

  router.post('/updslottime', function(req, res, next) {  
    // res.send('hiii');
    //  console.log(req.body);
    var editstime=req.body.updtimeslot;
    console.log(editstime);
   // return false;
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
    //const foundUser = User.findOne({"email" : req.body.email });
   /*
    User.findOne({email: req.body.email}, function(err, document) {
      console.log('Data is'+document.email);
    }); */
    var redirectUr='';
    User.findOne({email: req.body.email}, function(err, dt) { 
      if(dt.user_role=='1'){
        redirectUr='/profile-setting';
      } 
      else if(dt.user_role=='2'){
        redirectUr='/patient-profile-setting';
      }
      passport.authenticate('local',{
        successRedirect : redirectUr,
        failureRedirect : '/login',
        failureFlash : true,
        })(req,res,next);
    });
     //console.log(redirectUr)
   
   // var userRole=foundUser.user_role;
    //console.log("Role id"+foundUser.email)


         
})
 
//logout
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','Now logged out');
res.redirect('/login');
})
module.exports = router;
