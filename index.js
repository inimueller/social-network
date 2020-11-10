const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3Url = "https://s3.amazonaws.com/spicedling/";

// 1. MIDDLEWARE

// cookies
app.use(
    cookieSession({
        secret: "I'm always hungry",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// i'm pretty sure this refers to the image uploading

app.use(compression());

// csurf token

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ALWAYS REMEMBER express and json

app.use(express.static("public"));

app.use(express.json());

//UPLOADER FILES STUFF, boilerplate:

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

////////// ends of boilerplate

////// middlewere compiler for react (2 ports thing)

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//  ------ logged out user ------  //

//////// register POST req

app.post("/register", (req, res) => {
    console.log(req.body);
    const { first, last, email, password } = req.body;

    // checks that all the fields are filled
    if (first !== "" && last !== "" && email !== "" && password !== "") {
        // TO-DO Que pasa cuando el email ya esta en la DB ?
        hash(password)
            .then((hashedPw) => {
                console.log("parametros:", first, last, email, hashedPw);
                return db.createUser(first, last, email, hashedPw);
            })
            .then((results) => {
                // console.log("results: ", results);
                const { id } = results.rows[0];
                req.session.userId = id;
                // console.log("req.session: ", req.session);

                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error post /register route: ", err);
                res.json({ success: false });
            });
    }
});

/// login POST request

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.getUser(email)
        .then(({ rows }) => {
            const { id } = rows[0];
            const hash = rows[0].password;
            compare(password, hash)
                .then((result) => {
                    if (result) {
                        req.session.userId = id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("error in post /login: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in post /login: ", err);
            res.json({ success: false });
        });
});

// rest password POST request

app.post("/reset/email", (req, res) => {
    const { email } = req.body;
    console.log(" POST /reset/email route working");

    if (email !== "") {
        db.checkEmail(email)
            .then(({ rows }) => {
                if (rows.length === 1) {
                    // this generates a reset code ->
                    const resetCode = cryptoRandomString({
                        length: 6,
                    });
                    // this inserts resetCode and the email into database (only if email already exists)
                    db.addCode(resetCode, email)
                        .then(() => {
                            let recipient = email;
                            let message = `To reset yuor password please copy and paste this code: ${resetCode}`;
                            let subject = `Here is your secret code`;
                            ses.sendEmail(recipient, message, subject)
                                .then(() => {
                                    res.json({
                                        success: true,
                                    });
                                })
                                .catch((err) => {
                                    console.log(
                                        "error in POST /reset/email when sending email: ",
                                        err
                                    );
                                });
                        })
                        .catch((err) => {
                            console.log(
                                "error in POST /reset/email when adding code",
                                err
                            );
                        });
                } else {
                    console.log("This email does not exist in our database");
                }
            })
            .catch((err) => {
                console.log(
                    "error in POST /reset/email with checkEmail()",
                    err
                );
            });
    } else {
        console.log("don't forget your email");
    }
});

// ---------- logged in user ---------- //

// upload profile pic POST request

app.post("/images", uploader.single("file"), s3.upload, (req, res) => {
    console.log("ACCESSED POST /images route ");

    const { userId } = req.session;
    const { filename } = req.file;
    const url = s3Url + filename;
    if (req.file) {
        db.uploadImage(url, userId)
            .then(({ rows }) => {
                console.log("POST /images response", rows[0].url);
                res.json(rows[0].url);
            })
            .catch((err) => {
                console.log("error in POST /upload with uploadImage()", err);
            });
    } else {
        res.json({ success: false });
    }
});

// verify password POST request

app.post("/reset/verify", (req, res) => {
    const { email, code, password } = req.body;

    if (code !== "" && password !== "") {
        db.getCode(email)
            .then((response) => {
                if (response.rows[0].code == code) {
                    hash(password)
                        .then((hashedPw) => {
                            db.updatePassword(hashedPw, email)
                                .then(({ rows }) => {
                                    console.log(
                                        "Error in reset 2nd display",
                                        rows
                                    );
                                    res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.log(
                                        "Error in reset third display",
                                        err
                                    );
                                });
                        })
                        .catch((err) => {
                            console.log("error in POST /register", err);
                        });
                } else {
                    console.log("That is the wrong code");
                }
            })
            .catch((err) => {
                console.log("error in POST (invalid code???)", err);
            });
    } else {
        console.log("every field must be filled");
    }
});

//////// update bio  POST request

app.post("/bio", (req, res) => {
    console.log("ACCESSED POST /bio route ");
    const { userId } = req.session;
    const { bioDraft } = req.body;

    db.updateBio(bioDraft, userId)
        .then(({ rows }) => {
            console.log("POST /bio response", rows[0].bio);
            res.json(rows[0].bio);
        })
        .catch((err) => {
            console.log("error in POST /bio with uploadProfilePic", err);
            res.json({
                success: false,
            });
            console.log("Updating bio didn't work");
        });
});

/////// GET REQUESTS!!!!!!!!!! //////

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// get -> user profile

app.get("/user", (req, res) => {
    const { userId } = req.session;
    // console.log(userId);
    db.getUserById(userId)
        .then(({ rows }) => {
            // console.log("rows in index /user: ", rows);
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error in GET /user: ", err);
        });
});

// get -> otherProfiles

app.get("/api/user/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.session;
    console.log("{id} in get /api/user/:id:", id);

    // if(user id exists in database) //add condition for non-existing users
    db.getOtherProfiles(id)
        .then(({ rows }) => {
            if (rows[0]) {
                console.log("rows[0] in GET /user/:id:", rows[0]);
                res.json(rows[0]);
            } else {
                console.log("user does not exist");
                res.json({
                    errorMsg: "User {id} does not exist",
                    success: false,
                });
            }
        })
        .catch((err) => {
            "err in GET api/user/:id", err;
            res.json({
                success: false,
                errorMsg: "Oops, that user does not exist",
            });
        });
});

// app.get("/ini", (req, res) => {
//     console.log("route ini does show up");
// }); //test -> console logs are not showing up :(( -> solved by turning computer off and on LOL

// it is important that the * route is the LAST get route we have !!!!!!!!!!

app.get("*", function (req, res) {
    // console.log("req.session: ", req.session);
    // console.log("ïni");
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        // console.log("else block");
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
