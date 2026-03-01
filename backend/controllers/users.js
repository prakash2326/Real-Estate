const passport = require("passport");
const { Client, Admin } = require("../models/user.js");

function normalizeUser(user) {
    if (!user) return null;
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.constructor.modelName,
    };
}

module.exports.signupApi = async (req, res) => {
    const { username, email, password, role } = req.body;
    const isAdmin = role === "admin";
    const UserModel = isAdmin ? Admin : Client;
    const newUser = new UserModel({ email, username });
    const registeredUser = await UserModel.register(newUser, password);

    req.login(registeredUser, (err) => {
        if (err) {
            return res.status(500).json({ error: "Signup succeeded but login failed." });
        }
        return res.status(201).json({
            message: "Welcome to Wanderlust!",
            data: normalizeUser(registeredUser),
        });
    });
};

module.exports.loginApi = (req, res, next) => {
    const strategy = req.body.role === "admin" ? "admin-local" : "client-local";

    passport.authenticate(strategy, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: info?.message || "Invalid credentials" });
        }
        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({
                message: "Logged in successfully",
                data: normalizeUser(user),
            });
        });
    })(req, res, next);
};

module.exports.logoutApi = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            return res.json({ message: "Logged out successfully" });
        });
    });
};

module.exports.sessionApi = (req, res) => {
    return res.json({
        authenticated: req.isAuthenticated(),
        data: normalizeUser(req.user),
    });
};
