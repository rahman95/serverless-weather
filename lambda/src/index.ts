import axios, { AxiosResponse } from 'axios';
import { APIGatewayEvent } from 'aws-lambda';
import { getAccessKey, handleParams, response } from './util';

const apiBaseUrl = 'http://api.weatherstack.com/current';

const handler = async (event: APIGatewayEvent): Promise<Response> => {
  try {
    const accessKey = await getAccessKey(event);
    const query = handleParams(event);
    const weather = await getWeather(accessKey, query);

    if (weather.status !== 200) {
      throw new Error('No Weather data found!');
    }

    return await response(200, { weather: weather.data });
  } catch (err) {
    return await response(500, { message: err.message });
  }
};

const getWeather = async (accessKey: string, query: string): Promise<AxiosResponse> => {
  const res = await axios.get(`${apiBaseUrl}`, {
    params: {
      access_key: accessKey,
      query,
    },
  });

  return res;
};

export { handler };
