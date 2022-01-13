import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import constants from '@/config/constants';

const http: AxiosInstance = axios.create({
  baseURL: constants.apiURL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default http;

/**
 * type contains the Axios Error object's response or a custom error object
 */
export type TErrorHandlerResponse = ({
  err: AxiosError['response']
} | {
  err: {
    status: number;
    statusText: string;
  }
});

/**
 * Globally handles wanted or unwanted network errors.
 */
export const errorHandler = (err: AxiosError | unknown): TErrorHandlerResponse => {
  if (axios.isAxiosError(err)) {
    /**
     * Handle Error Response Codes
     */
    // TODO: adapt to api error handling
    return {
      err: err.response,
    };
  }

  /**
   * Handle unknown network errors
   */
  console.error('Unknown network error\n', err);

  return {
    err: {
      status: 500,
      statusText: `Unknown network error ${err}`,
    },
  };
};

/**
 * Validate server response
 */
export const validateResponse = (res: AxiosResponse): AxiosResponse['data'] | undefined => {
  const responseData = res.data;
  if (!responseData) {
    errorHandler(responseData);
    return undefined;
  }

  return responseData;
};
