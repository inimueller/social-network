let spicedPg = require("spiced-pg");
let db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnet`
);
module.exports.createUser = (first, last, email, password) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) 
        RETURNING id
        `,
        [first, last, email, password]
    );
};
module.exports.getUser = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};
