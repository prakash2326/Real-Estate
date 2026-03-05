if(process.env.NODE_ENV != "production"){
    require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const methodOverride = require("method-override");
const  ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default
console.log('connect-mongo export:', MongoStore);
const flash = require("connect-flash");
const passport =require("passport");
const LocalStrategy = require("passport-local")
const { Client, Admin } =require("./models/user.js");

const apiPropertyRouter = require("./routes/apiProperty.js");
const apiAuthRouter = require("./routes/apiAuth.js");
const apiBookingRouter = require("./routes/apiBooking.js");


// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS;
if (!dbUrl) {
    throw new Error("Missing ATLAS connection string in environment");
}

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));





const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,

    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use("client-local", new LocalStrategy(Client.authenticate()));
passport.use("admin-local", new LocalStrategy(Admin.authenticate()));

passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.constructor.modelName });
});

passport.deserializeUser(async (sessionUser, done) => {
    try {
        if (!sessionUser || !sessionUser.id || !sessionUser.role) {
            return done(null, false);
        }

        const Model = sessionUser.role === "Admin" ? Admin : Client;
        const user = await Model.findById(sessionUser.id);
        done(null, user || false);
    } catch (err) {
        done(err);
    }
});


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.searchParams = {
        q: req.query.q || "",
        minRent: req.query.minRent || "",
        maxRent: req.query.maxRent || "",
        available: req.query.available || "all",
    };
    // console.log(res.locals.success);
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.get("/", (req, res) => {
    return res.redirect("/app");
});


app.use("/api/properties", apiPropertyRouter);
app.use("/api/auth", apiAuthRouter);
app.use("/api/bookings", apiBookingRouter);

app.get("/Properties", (req, res) => res.redirect("/app"));
app.get("/login", (req, res) => res.redirect("/app/login"));
app.get("/signup", (req, res) => res.redirect("/app/signup"));
app.get("/bookings", (req, res) => res.redirect("/app/bookings"));
app.get("/logout", (req, res) => res.redirect("/app"));

const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");
if (process.env.NODE_ENV === "production" && fs.existsSync(frontendDistPath)) {
    app.use("/app", express.static(frontendDistPath));
    app.get(/^\/app(?:\/.*)?$/, (req, res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
}

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="something went wrong"} = err;
    if (req.originalUrl.startsWith("/api/")) {
        return res.status(statusCode).json({ error: message });
    }
    res.status(statusCode).json({ error: message });
});
async function startServer() {
    try {
        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("connected to DB");

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`server is listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

startServer();

