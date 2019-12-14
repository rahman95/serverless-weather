const axios = require("axios");
const { getAccessKey, handleParams, response } = require("./util");

const apiBaseUrl = "http://api.weatherstack.com/current";

exports.handler = async event => {
  try {
    const accessKey = await getAccessKey(event);
    const query = handleParams(event);
    const weather = await getWeather(accessKey, query);

    if (!weather || !weather.hasOwnProperty("location")) {
      throw new Error("No Weather data found!");
    }

    return await response(200, { weather });
  } catch (err) {
    return await response(500, { message: err.message });
  }
};

const getWeather = async (accessKey, query) => {
  const res = await axios.get(`${apiBaseUrl}`, {
    params: {
      access_key: accessKey,
      query
    }
  });

  return res.data;
};
