const Client = require("../models/Client.js");



// SIGNUP FORM

module.exports.signupForm = (req, res) => {

    res.render("Client/signup.ejs");

};
module.exports.signupForm = (req, res) => {

    res.render("Client/signup.ejs");

};



// CREATE CLIENT

module.exports.signup = async (req, res, next) => {

  


    let {
        username,
        email,
        password
    } = req.body;


    let Cl_data = new Client({
        username,
        email
    });


    let fndata = await Client.register(
        Cl_data,
        password
    );


    req.login(fndata, (err) => {

        if(err){
            return next(err);
        }


        req.flash(
            "success",
            "welcome to wonderlust"
        );


        res.redirect("/listitems");

    });

};





// LOGIN FORM

module.exports.loginForm = (req,res)=>{

    res.render("Client/login.ejs");

};
module.exports.showUsers = async (req, res) => {

    let users = await Client.find({}).select("email");

    res.render("Client/Users.ejs", { users });

};





// LOGIN SUCCESS

module.exports.login = (req,res)=>{

   


    res.redirect("/listitems");

};





// LOGOUT

module.exports.logout = (req,res,next)=>{


    req.logout((err)=>{

        if(err){
            return next(err);
        }


        req.flash(
            "success",
            "logged out successfully"
        );


        res.redirect("/listitems");

    });

};