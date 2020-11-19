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

module.exports.checkEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

// reseting password

module.exports.addCode = (code, email) => {
    return db.query(
        `
        INSERT INTO reset_codes (code, email)
        VALUES($1,$2)
    `,
        [code, email]
    );
};

module.exports.getCode = (email) => {
    return db.query(
        `
        SELECT code 
        FROM reset_codes
        WHERE email=$1 
        AND CURRENT_TIMESTAMP - timestamp <= '10 minutes'
        ORDER BY id DESC 
        LIMIT 1;
        `,
        [email]
    );
};

module.exports.updatePassword = (password, email) => {
    return db.query(
        `
        UPDATE users 
        SET password=$1
        WHERE email = $2
    `,
        [password, email]
    );
};

// changing profile pic

exports.uploadImage = (url, id) => {
    return db.query(
        `UPDATE users SET url = $1 WHERE id = $2 RETURNING url;
    `,
        [url, id]
    );
};

module.exports.getUserById = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// updating bio

module.exports.updateBio = (bio, id) => {
    return db.query(
        `
        UPDATE users
        SET bio=$1
        WHERE id=$2
        RETURNING *
        `,
        [bio, id]
    );
};

// getting otherProfiles

exports.getOtherProfiles = (id) => {
    return db.query(
        `SELECT first, last, url, bio, id FROM users WHERE id = $1`,
        [id]
    );
};

// geting 3 last users
module.exports.getLastUsers = () => {
    return db.query(
        `
        SELECT id, first, last, url FROM users 
        ORDER BY id 
        DESC LIMIT 3
        `
    );
};

// geting search matchs
// should expect a string!

module.exports.getMatchUsers = (str) => {
    return db.query(
        `
        SELECT id, first, last, url FROM users
        WHERE first ILIKE $1
        ORDER BY first 
        `,
        [str + "%"]
    );
};

// these queries check for friendship status and change them depending on the button status ->

module.exports.checkFriendStatus = (sender_id, recipient_id) => {
    return db.query(
        ` SELECT * FROM friendships
  WHERE (recipient_id = $2 AND sender_id = $1)
  OR (recipient_id = $1 AND sender_id = $2);`,
        [recipient_id, sender_id]
    );
};

module.exports.sendFriendRequest = (sender_id, recipient_id) => {
    return db.query(
        `INSERT INTO friendships 
        (sender_id, recipient_id) 
        VALUES ($1, $2);
`,
        [sender_id, recipient_id]
    );
};

module.exports.acceptFriendRequest = (recipient_id, sender_id, accepted) => {
    return db.query(
        `UPDATE friendships 
        SET accepted=$3 
        WHERE sender_id=$2 AND recipient_id=$1`,
        [recipient_id, sender_id, accepted]
    );
};

module.exports.cancelFriendRequest = (recipient_id, sender_id) => {
    return db.query(
        `  DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
        ;
        `,
        [recipient_id, sender_id]
    );
};

// this query gets all of your friends

module.exports.getFriends = (id) => {
    return db.query(
        ` SELECT users.id, first, last, url, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

// this query gets the last 10 messages

module.exports.getMessages = () => {
    return db.query(`SELECT chat.id, message, first, last, chat.created_at, url
        FROM chat
        JOIN users
        ON user_id = users.id
        ORDER BY chat.created_at DESC
        LIMIT 10;
        `);
};

// this query addes messages

module.exports.addMessage = (id, msg) => {
    return db.query(
        `INSERT INTO chat (user_id, message) VALUES ($1, $2) RETURNING *`,
        [id, msg]
    );
};
