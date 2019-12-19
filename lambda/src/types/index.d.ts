type Response = {
  statusCode: number;
  headers: object | null;
  body: string;
};

interface WeatherData {
  request?: object;
  location?: object;
  current?: object;
}

interface WeatherError {
  success?: boolean;
  error?: WeatherStackError;
}
interface WeatherStackError {
  code?: number;
  type?: string;
  info?: string;
}
