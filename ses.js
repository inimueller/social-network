const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
    // means we are in prod and our secrets
    // are in the environment variables
} else {
    secrets = require("./secrets.json");
    //in dev our secrets are in our secrets.json,
    // make sure this file is listed in your .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = function (recipient, message, subject) {
    return ses
        .sendEmail({
            Source: "Ini Molina <chestnut.hummingbird@spicedling.email>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("it worked! reset email got sent!"))
        .catch((err) => console.log("error in ses.SendEmail: ", err));
};
