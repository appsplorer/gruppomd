var express = require('express');
var router = express.Router();
const passport=require("passport");

var adminController=require("../../controller/admin/admin");

// admin login routes

router.get('/login', function(req, res, next) {
    res.render('admin/pages/login');
  });
router.get('/dashboard',(req,res,next)=>{
  res.render("admin/pages/index");
})
router.post(
  "/login",
  passport.authenticate("local-admin",{
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })
);
  module.exports = router;
