const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { hash } = require("./bc");
const db = require("./db");

app.use(express.json());
app.use(
    cookieSession({
        secret: "I'm always hungry",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(compression());

app.use(express.static("public"));

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

// app.post("/register", (req, res) => {
//     console.log("Hit the post register route!!!");
//     console.log("req.body: ", req.body);

//     // when everything works (i.e. hashing and inserting a row, and adding somethin to the session object)
//     req.session.userId = 1;
//     res.json({ success: true });
// });

app.post("/register", (req, res) => {
    // grab the user input and read it on the server
    // like this? ->
    console.log(req.body);
    const { first, last, email, password } = req.body;
    // console.log("datos ingresados: ", first, last, email, password);

    // checks that all the fields are filled
    if (
        first !== "" &&
        last !== "" &&
        email !== "" &&
        password !== ""
        // hash the passowrd that the user typed and THEN-> insert a row in the USERS table
    ) {
        // TO-DO Que pasa cuando el email ya esta en la DB ?
        hash(password)
            .then((hashedPw) => {
                console.log("parametros:", first, last, email, hashedPw);
                return db.createUser(first, last, email, hashedPw);
            })
            .then((results) => {
                console.log(results);
                const { id } = results.rows[0];
                req.session.userId = id;
                res.json({ success: true }); // why is tis not working?
            })
            .catch((err) => {
                console.log("error post /register route: ", err);
                res.json({ success: false });
            });
    }
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// it is important that the * route is the LAST get route we have....
app.get("*", function (req, res) {
    console.log("req.session: ", req.session);
    // console.log("req.session.userId: ", req.session.userId);
    // console.log("!res.session.userId: ", !res.session.userId);
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
