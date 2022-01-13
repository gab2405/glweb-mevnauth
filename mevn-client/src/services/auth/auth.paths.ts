import constants from '@/config/constants';

const authPaths = {
  user: {
    login: `${constants.apiURL}/user/login`,
    profile: `${constants.apiURL}/user/profile`,
  },
};

export default authPaths;
