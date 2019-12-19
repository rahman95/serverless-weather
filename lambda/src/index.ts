import { APIGatewayEvent } from 'aws-lambda';
import { getWeather, getAccessKey, handleParams, response } from './util';

const handler = async (event: APIGatewayEvent): Promise<Response> => {
  try {
    const accessKey = await getAccessKey(event);
    const query = handleParams(event);
    const weather = await getWeather(accessKey, query);

    if (weather.status !== 200) {
      throw new Error('No Weather data found!');
    }

    return response(200, true, { weather: weather.data });
  } catch (err) {
    return response(500, false, { message: err.message });
  }
};

export { handler };
