const axios = require("axios");

const apiBaseUrl = "http://api.weatherstack.com";
const accessKey = "ABC123";

exports.handler = async (event, context, callback) => {
  const ipAddress = event.requestContext.identity.sourceIp;
  const weather = await getWeather(ipAddress);

  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      weather
    })
  };

  callback(null, response);
};

const getWeather = async ipAddress => {
  return await axios.get(`${apiBaseUrl}/current`, {
    access_key: accessKey,
    query: ipAddress
  });
};
