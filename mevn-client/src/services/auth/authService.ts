import { AxiosError, AxiosResponse } from 'axios';
import http, { errorHandler, validateResponse, TErrorHandlerResponse } from '../apiClient';
import path from './auth.paths';
import { ILoginResponse, IProfileResponse } from './auth.types';
import { localService } from '../storageHandler';

export default {

  /**
   * attemt to log the user in
   * @param {{email: string, password: string}} data
   * @returns {Promise<AxiosResponse | undefined>}
   */
  login: async (data: {
    email: string;
    password: string;
  }): Promise<ILoginResponse | TErrorHandlerResponse> => {
    const body = {
      email: data.email,
      password: data.password,
    };
    try {
      const res = await http.post(path.user.login, body);
      return validateResponse(res);
    } catch (err) {
      return errorHandler(err);
    }
  },

  /**
   * get the profile of the logged-in user
   * @returns {Promise<AxiosResponse | undefined>}
   */
  getProfile: async (): Promise<IProfileResponse | TErrorHandlerResponse> => {
    try {
      const jwt = localService.get('jwt');
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const res = await http.get(path.user.profile, config);
      return validateResponse(res);
    } catch (err) {
      return errorHandler(err);
    }
  },
};
