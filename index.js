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

//socket.io requirement statements ->
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

// 1. MIDDLEWARE

// cookies before socket //
/*
app.use(
    cookieSession({
        secret: "I'm always hungry",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
*/

// 2. COOKIES AFTER SOCKET!

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// i'm pretty sure this compression refers to the image uploading but idrk

app.use(compression());

// csurf token

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ALWAYS REMEMBER express and json!

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

////////// ends of uploader boilerplate

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

// 🚫 ------ logged out user ------ 🚫 //

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
                            let buttonText = `To reset yuor password please copy and paste this code: ${resetCode}`;
                            let subject = `Here is your secret code`;
                            ses.sendEmail(recipient, buttonText, subject)
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

// ✅ ---------- logged in user ---------- ✅ //

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
    console.log(userId);
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
    const { bio } = req.body;

    db.updateBio(bio, userId)
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

// FriendButton post request

app.post("/friendStatus/:buttonText", (req, res) => {
    const { id } = req.body;
    const { buttonText } = req.params;
    const { userId } = req.session;

    // console.log({ id });
    // console.log({ userId });
    // console.log({ buttonText });

    if (buttonText == "Send Friend Request") {
        db.sendFriendRequest(userId, id)

            .then(() => {
                res.json({ buttonText: "Cancel Friend Request" });
            })
            .catch((err) => {
                console.log("error in sendFriendRequest:", err);
                // console.log("req.session.userId: ", userId);
            });
    } else if (buttonText == "Unfriend") {
        db.cancelFriendRequest(id, userId)
            .then(() => {
                res.json({ buttonText: "Send Friend Request" });
            })
            .catch((err) => {
                console.log("error in cancelFriendRequest: ", err);
            });
    } else if (buttonText == "Accept Friend Request") {
        db.acceptFriendRequest(userId, id, true)
            .then(() => {
                res.json({ buttonText: "Unfriend" });
            })
            .catch((err) => {
                console.log("error in acceptFriendRequest: ", err);
            });
    } else if (buttonText == "Cancel Friend Request") {
        db.cancelFriendRequest(id, userId)
            .then(() => {
                res.json({ buttonText: "Send Friend Request" });
            })
            .catch((err) => {
                console.log("error in cancelFriendRequest: ", err);
            });
    }
});
/////// 🧲 GET REQUESTS!!!!!!!!!! 🧲  //////

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
    console.log(userId);
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

    // if the id is different of the id in the cookies that code should run (if not -> line 333)

    if (id != userId) {
        db.getOtherProfiles(id)
            .then(({ rows }) => {
                if (rows[0]) {
                    console.log("rows[0] in GET /user/:id:", rows[0]);
                    res.json(rows[0]);
                } else {
                    console.log("user does not exist");
                    res.json({ editing: true });
                }
            })
            .catch((err) => {
                "err in GET api/user/:id", err;
                res.json({
                    errorMsg: "Oops, that user does not exist",
                });
            });
        // if not -> editing: true (OtherProfile line 21)
    } else {
        res.json({ editing: true });
    }
});

// get -> last 3 users

app.get("/api/users", (req, res) => {
    console.log("ACCESSED GET /api/users route");

    db.getLastUsers()
        .then(({ rows }) => {
            console.log("rows -> db.getLastUsers", rows);
            res.json({
                success: true,
                rows,
            });
        })
        .catch((err) => {
            console.log({ err }); //does this work? 🤔
        });
});

// get -> it dinamically calls the db query of users whose names match the user's input

app.get(`/api/users/:search`, (req, res) => {
    console.log("req.params in api/search", req.params);
    const { search } = req.params;

    db.getMatchUsers(search)
        .then(({ rows }) => {
            if (rows.length != 0) {
                res.json({
                    success: true,
                    rows,
                });
            } else {
                res.json({
                    success: false,
                    // error: "No users found",

                    //how to display an errror messsage??? like that?
                });
                console.log("Not users found");
            }
        })
        .catch((err) => {
            console.log("err in /api/users/:search", err);
        });
});

// get -> friendship status

app.get("/friendStatus/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    const { userId } = req.session;
    console.log(req.params);

    // determines the initial status between logged in user (id in cookie)
    // and the user who's page we're viewing BEFORE user clicks the button
    // ------- //
    // console.log("otherUserId;, ", otherUserId);
    // console.log("id;, ", userId);
    // console.log("req.session: ", req.session);

    db.checkFriendStatus(otherUserId, userId)
        .then(({ rows }) => {
            // console.log("rows in checkFriendStatus : ", rows);
            if (!rows[0]) {
                res.json({ buttonText: "Send Friend Request" });
            } else if (rows[0].accepted) {
                res.json({ buttonText: "Unfriend" });
            } else if (!rows[0].accepted) {
                if (rows[0].recipient_id == userId) {
                    res.json({
                        buttonText: "Accept Friend Request",
                    });
                } else {
                    res.json({
                        buttonText: "Cancel Friend Request",
                    });
                }
            }
        })
        .catch((err) => {
            console.log("error in get friendStatus: ", err);
        });
});

// this is where I see my friends (and wannabes?)

app.get("/getFriends", (req, res) => {
    const { userId } = req.session;
    console.log({ userId });

    db.getFriends(userId)
        .then(({ rows }) => {
            res.json({ rows });
            console.log("rows in getFriends : ", rows);
        })
        .catch((err) => {
            console.log("error in getFriends", err);
        });
});

// get-> logout

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// app.get("/ini", (req, res) => {
//     let ini = "testing";

//     console.log(ini);

//     console.log({ ini });
// });

//test -> console logs are not showing up :(( -> solved by turning computer off and on LOL

// it is important that the * route is the LAST get route we have !!!!!!!!!!

app.get("*", function (req, res) {
    // console.log("req.session: ", req.session);
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        // console.log("else block");
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8000, function () {
    console.log("I'm listening.");
});

/* 

SOCKET CODE goes here

*/

io.on("connection", (socket) => {
    // console.log(`socket with id ${socket.id} just connected!`);

    //we are adding a double layer of protection and making sure that only users
    //with the right cookie are recognised as connected sockets

    // RETRIEVING OUR CHAT HISTORY
    // 1. need to get our chat history from the db
    // 2. once we have our chat history we want to emit the chats to all our clients
    // sth like db.getMsgs().then(data=> blablabla)
    //  we do this with->

    const userId = socket.request.session.userId;

    console.log(socket.request.session.userId);
    console.log("you are connected");
    db.getMessages().then(({ rows }) => {
        console.log("rows in getMessages: ", rows);
        io.emit("chatHistory", rows.reverse());
    });
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    // 1st argument is what we will have to listen for on the client side
    // 2nd argument is the dataload we want to send along

    // RECEIVING A NEW MESSAGE FROM CONNECTED SOCKET
    socket.on("newMessage", (msg) => {
        // console.log("received amazing new msg from client: ", msg);
        // we want to find out who sent this msg
        // console.log("author of the msg was user with id: ", userId);
        // 1st argument is the key
        // 2nd argument is a callback function containing the newMsg
        db.addMessage(userId, msg).then(({ rows }) => {
            db.getUserById(userId).then((answer) => {
                rows[0].first = answer.rows[0].first;
                rows[0].last = answer.rows[0].last;
                rows[0].url = answer.rows[0].url;
                io.emit("addNewMessage", rows);
            });
        });
    });
    // we need to add this msg to the chat table
    // we also want to retrieve the info of the author of the msg (first, last and url) FROM our user table
    // compose a msg OBJECT containing the user info and the new msg that got sent
    // make sure if structurally matches with what your msg objects in the chat history look like

    socket.on("disconnect", () => {
        // console.log("user " + socket.id + " has disconnected");
    });
});
