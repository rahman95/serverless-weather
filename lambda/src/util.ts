import ejs, { Data } from 'ejs';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';
import { decryptValue } from './kms';

const apiBaseUrl = 'http://api.weatherstack.com/current';
const viewDir = './view';
const successView = `${viewDir}/success.ejs`;
const errorView = `${viewDir}/error.ejs`;

const getWeather = async (accessKey: string, query: string): Promise<WeatherData> => {
  const res = await axios.get(`${apiBaseUrl}`, {
    params: {
      access_key: accessKey,
      query,
    },
  });
  const { data } = res;

  if (!data || !Object.prototype.hasOwnProperty.call(data, 'location')) {
    throw new Error('No Weather data found!');
  }

  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = async (key: string, isEncrypted: boolean, defaultValue: any = null): Promise<string> => {
  if (!process.env[key]) {
    return defaultValue;
  }

  if (!isEncrypted) {
    return process.env[key];
  }

  return decryptValue(process.env[key]);
};

const getQueryParam = (event: APIGatewayEvent, key: string): string | null => {
  return event.queryStringParameters && event.queryStringParameters[key];
};

const getCity = (event: APIGatewayEvent): string | null => {
  return getQueryParam(event, 'city');
};

const getIpAddress = (event: APIGatewayEvent): string | null => {
  return event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp;
};

const handleParams = (event: APIGatewayEvent): string => {
  const city = getCity(event);
  const ipAddress = getIpAddress(event);

  if (city && city.length > 0) {
    return city;
  }

  if (ipAddress && ipAddress.length > 0) {
    return ipAddress;
  }

  throw new Error('No city parameter passed or IP address not available');
};

const getAccessKey = async (event: APIGatewayEvent): Promise<string> => {
  const accessKey = await env('ACCESS_KEY', true, getQueryParam(event, 'access_key'));

  if (!accessKey) {
    throw new Error('No Access key passed!');
  }

  return accessKey;
};

const renderHtml = async (success: boolean, data: Data): Promise<string> => {
  const filename = success ? successView : errorView;

  return ejs.renderFile(filename, data);
};

const response = async (statusCode: number, success: boolean, content: Data): Promise<Response> => {
  const html = await renderHtml(success, content);

  return {
    statusCode,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };
};

export { getWeather, getAccessKey, handleParams, response };
