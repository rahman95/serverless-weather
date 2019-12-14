const { KMS } = require("aws-sdk");

const decryptValue = async encrypted => {
  try {
    const kms = new KMS();
    const res = await kms
      .decrypt({
        CiphertextBlob: Buffer.from(encrypted, "base64")
      })
      .promise();

    return res.Plaintext.toString();
  } catch (err) {
    throw new Error("An error occured trying to decrypt value");
  }
};

module.exports = { decryptValue };
