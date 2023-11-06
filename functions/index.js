/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
// const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

exports.upload = functions.https.onRequest(async (req, res) => {
    try {
        cors(req, res, async () => {
            // VALIDATE REQUEST
            if (req.method !== "POST") {
                res.status(405).send("Method Not Allowed");
                return;
            }

            const formData = req.body.data;
            console.log("Form data received: ", formData);
            const email = formData.email;
            if (!email) {
                res.status(400).send("Email is required.");
                return;
            }

            const currentTime = getCurrentFormattedTime();
            const filename = `${currentTime}-${email}`;
            const mimetype = "application/pdf";
            const base64EncodedFile = formData.file.split(",")[1];
            const fileBuffer = Buffer.from(base64EncodedFile, "base64");
            const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

            if (!fileBuffer) {
                res.status(400).send("No file uploaded.");
                return;
            }

            // STORE FORM DATA IN FIRESTORE
            const logData = {
                email: email,
                name: formData.name,
                optin: formData.optin,
                date: new Date(),
                ip: req.ip,
                filename: filename + ".pdf",
                fileHash: hash,
            };
            db.collection("contracts").doc(filename).set(logData);

            // STORE FILE IN STORAGE
            storeFile(fileBuffer, filename + ".pdf", mimetype, res);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


/**
 * Returns the current date and time formatted as YYYY-MM-DD:HH:MM:SS
 *
 * @return {string} The current date and time formatted as YYYY-MM-DD:HH:MM:SS
 */
function getCurrentFormattedTime() {
    const now = new Date();
    const formattedDate = [
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        now.getFullYear(),
    ].join("-");

    const formattedTime = [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
    ].join(":");

    const currentTime = `${formattedDate}:${formattedTime}`;
    return currentTime;
}

function storeFile(fileBuffer, filename, mimetype, res) {
    const bucketName = "wiley-sign.appspot.com";
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    const stream = file.createWriteStream({
        metadata: {
            contentType: mimetype,
        },
    });
    stream.on("error", (err) => {
        console.error(err);
        res.status(500).send("Server Error");
    });
    stream.on("finish", () => {
        res.status(200).json({ data: "File uploaded successfully!" });
    });
    stream.end(fileBuffer);
}

// function sendEmail() {
// SEND EMAIL
// Send email with link to uploaded file
// const transporter = nodemailer.createTransport({
//   host: "smtp.forwardemail.net",
//   port: 465,
//   secure: true,
//   auth: {
//     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
//     pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
//   },
// });

// const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filename}?alt=media`;
// const mailOptions = {
//   from: "your_email@gmail.com",
//   to: email,
//   subject: "Your Contract",
//   text: `Here is your contract: ${fileUrl}`,
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log(error);
//     res.status(500).send("Error sending email");
//     return;
//   }
//   console.log("Email sent: " + info.response);
//   res.status(200).send("Email sent successfully");
// });
// }


// RATE LIMIT
// const ip = req.ip;
// const windowStartTime = currentTime - (15 * 60 * 1000); // 15 minutes
// // Get the request count for this IP in the current rate limit window
// const requestCountSnapshot = await db.collection("rateLimits").doc(ip)
//     .collection("requests").where("timestamp", ">", windowStartTime)
//     .get();
// if (requestCountSnapshot.size >= 100) {
//   res.status(429).send("Too many requests, please try again later.");
//   return;
// }
// await db.collection("rateLimits").doc(ip)
//     .collection("requests").add({timestamp: currentTime});
