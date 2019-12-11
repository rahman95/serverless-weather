const { KMSClient } = require("@aws-sdk/client-kms-node");

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

module.exports = { decryptValue };
