// https://github.com/aws/aws-sdk-js-v3/tree/master/clients/node/client-kms-node

const { KMSClient } = require("@aws-sdk/client-kms-node");

const encrypted = process.env["ACCESS_KEY"];

function decryptValue(encrypted)
{
  try {
    const kms = new KMSClient();
    const res = await kms.decrypt({
      CiphertextBlob: new Buffer(encrypted, "base64")
    }).promise();
  
    return res.Plaintext.toString();
  } catch(err) {
    throw new Error(err.message)
  }
}

