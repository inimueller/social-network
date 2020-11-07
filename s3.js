// boilerplate code

const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    // this creates an instance of an AWS user -> it is basically an object
    //that has methods that allow us to communicate with our S3 bucket
});

// like any middleware we have req, res and next.
exports.upload = (req, res, next) => {
    if (!req.file) {
        //something went wrong with multer or the user didn't select an image to upload
        console.log("not file to upload");
        return res.sendStatus(500);
    }
    // boiler plate
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling", // if you are using spiced.space generated credentials you want this to be called spicedling
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("yay our image made it to the cloud :)");
            next(); // we want to make sure to exit the middleware after successfully uploading the img to the cloud
            // optionally you can chose to remove the file we just uploaded to the cloud from the uploads dir
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log("something went wrong with uploading to the cloud :(");
            console.log(err);
        });

    // boiler plate ends
};
