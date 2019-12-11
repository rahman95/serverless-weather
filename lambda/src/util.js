const { decryptValue } = require("./kms");

const env = (key, isEncrypted, defaultValue = null) => {
  if (!process.env[key]) {
    return defaultValue;
  }

  if (!isEncrypted) {
    return process.env[key];
  }

  return decryptValue(process.env[key]);
};

const getQueryParam = (event, key) => {
  return event.queryStringParameters && event.queryStringParameters[key];
};

const handleParams = event => {
  const city = getCity(event);
  const ipAddress = getIpAddress(event);

  if (city && city.length > 0) {
    return city;
  }

  if (ipAddress && ipAddress.length > 0) {
    return ipAddress;
  }

  throw new Error("No city parameter passed or IP address not available");
};

const getAccessKey = event => {
  const accessKey = env("ACCESS_KEY", true, getQueryParam(event, "access_key"));

  if (!accessKey) {
    throw new Error("No Access key passed!");
  }

  return accessKey;
};

const getCity = event => {
  return getQueryParam(event, "city");
};

const getIpAddress = event => {
  return (
    event.requestContext &&
    event.requestContext.identity &&
    event.requestContext.identity.sourceIp
  );
};

const response = (statusCode, content) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(content)
  };
};

module.exports = { getAccessKey, handleParams, response };
