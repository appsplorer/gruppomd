const User = require('../models/user');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
module.exports = function(passport){
    
    passport.use(
        new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
            //match user
            User.findOne({email:email})
            .then((user)=>{
                if(!user){
                    return done(null,false,{message:'email not registered'});
                }
                //math passwords
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        //var sess;
                          // var sess=sess=req.session;
                      //sess.email=email; // equivalent to $_SESSION['email'] in PHP.
   // sess.username; // equivalent to $_SESSION['username'] in PHP
    //res.send('we are chekcing')
                        return done(null,user);
                    } else{
                        return done(null,false,{message: 'password incorrect'});
                    }
                })
            })
            .catch((err)=>{console.log(err)})
        })

        // admin local strategy
        

    );
    passport.use(
        "local-admin",
    new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({email:email})
        .then((user)=>{
            if(!user){
                return done(null,false,{message:'email not registered'});
            }
            if(user.user_role!="0"){
                return done(null,false,{message:'you are not admin'});
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                } else{
                    return done(null,false,{message: 'password incorrect'});
                }
            })
        })
        .catch((err)=>{
            return done(null,false,{message:"Not match data"})
        })
    })        

);

    
    passport.serializeUser(function(user,done) {
        done(null,user.id);
    })
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        })
    })
}