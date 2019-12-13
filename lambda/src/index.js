const axios = require("axios");
const { getAccessKey, handleParams, response } = require("./util");

const apiBaseUrl = "http://api.weatherstack.com/current";

exports.handler = async event => {
  try {
    const accessKey = await getAccessKey(event);
    const query = handleParams(event);
    const weather = await getWeather(accessKey, query);

    return response(200, weather);
  } catch (err) {
    return response(500, err.message);
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
