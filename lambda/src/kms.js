// https://github.com/aws/aws-sdk-js-v3/tree/master/clients/node/client-kms-node

// FIX ME

const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });

const encrypted = process.env["ACCESS_KEY"];
let decrypted;

function processEvent(event, context, callback) {
  // TODO handle the event here
}

exports.handler = (event, context, callback) => {
  if (decrypted) {
    processEvent(event, context, callback);
  } else {
    // Decrypt code should run once and variables stored outside of the
    // function handler so that these are decrypted once per container
    const kms = new AWS.KMS();
    kms.decrypt(
      { CiphertextBlob: new Buffer(encrypted, "base64") },
      (err, data) => {
        if (err) {
          console.log("Decrypt error:", err);
          return callback(err);
        }
        decrypted = data.Plaintext.toString("ascii");
        processEvent(event, context, callback);
      }
    );
  }
};
