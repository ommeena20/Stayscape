const Client = require("../models/Client");

module.exports.signupForm = (req, res) => {
    res.render("clients/signup");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newClient = new Client({ username, email });
        const registered = await Client.register(newClient, password);
        req.login(registered, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome!");
            res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("clients/login");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
};

module.exports.showUsers = async (req, res) => {
    const users = await Client.find({});
    res.render("clients/users", { users });
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out");
        res.redirect("/");
    });
};