import ejs, { Data } from "ejs";
import { decryptValue } from "./kms";
import { APIGatewayEvent } from "aws-lambda";

const viewDir = "./view";
const successView = `${viewDir}/success.ejs`;
const errorView = `${viewDir}/error.ejs`;

const env = async (
  key: string,
  isEncrypted: boolean,
  defaultValue: any = null
): Promise<string> => {
  if (!process.env[key]) {
    return defaultValue;
  }

  if (!isEncrypted) {
    return process.env[key];
  }

  return await decryptValue(process.env[key]);
};

const getQueryParam = (event: APIGatewayEvent, key: string): string | null => {
  return event.queryStringParameters && event.queryStringParameters[key];
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

  throw new Error("No city parameter passed or IP address not available");
};

const getAccessKey = async (event: APIGatewayEvent): Promise<string> => {
  const accessKey = await env(
    "ACCESS_KEY",
    true,
    getQueryParam(event, "access_key")
  );

  if (!accessKey) {
    throw new Error("No Access key passed!");
  }

  return accessKey;
};

const getCity = (event: APIGatewayEvent): string | null => {
  return getQueryParam(event, "city");
};

const getIpAddress = (event: APIGatewayEvent): string | null => {
  return (
    event.requestContext &&
    event.requestContext.identity &&
    event.requestContext.identity.sourceIp
  );
};

const renderHtml = async (success: boolean, data: Data): Promise<string> => {
  const filename = success ? successView : errorView;

  return await ejs.renderFile(filename, data);
};

const response = async (
  statusCode: number,
  content: Data
): Promise<Response> => {
  const html = await renderHtml(statusCode == 200, content);

  return {
    statusCode,
    headers: {
      "Content-Type": "text/html"
    },
    body: html
  };
};

export { getAccessKey, handleParams, response };
