const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

app.use(
    cookieSession({
        secret: "I'm always hungry",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(compression());

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));

app.use(express.json());

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

//////// REGISTER POST REQUEST

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

/// LOGIN POST REQUEST

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

/////// GET REQ

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// it is important that the * route is the LAST get route we have....
app.get("*", function (req, res) {
    // console.log("req.session: ", req.session);

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
