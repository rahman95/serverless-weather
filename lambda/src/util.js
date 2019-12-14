const ejs = require("ejs");
const { decryptValue } = require("./kms");

const viewDir = "./view";
const successView = `${viewDir}/success.ejs`;
const errorView = `${viewDir}/error.ejs`;

const env = async (key, isEncrypted, defaultValue = null) => {
  if (!process.env[key]) {
    return defaultValue;
  }

  if (!isEncrypted) {
    return process.env[key];
  }

  return await decryptValue(process.env[key]);
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

const renderHtml = async (success, data) => {
  const filename = success ? successView : errorView;

  return await ejs.renderFile(filename, data);
};

const response = async (statusCode, content) => {
  const html = await renderHtml(statusCode == 200, content);

  return {
    statusCode,
    headers: {
      "Content-Type": "text/html"
    },
    body: html
  };
};

module.exports = { getAccessKey, handleParams, response };
