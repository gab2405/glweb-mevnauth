export interface IUserModuleState {
  isAuthenticated: boolean;
  profile: any;
}

export interface IUserModuleContext {
  commit: (mutation: string, payload: unknown) => void;
}

const userModule = {
  state: () => ({
    isAuthenticated: false,
    profile: {},
  }),
  mutations: {
    SET_IS_AUTHENTICATED(state: IUserModuleState, payload: boolean): void {
      state.isAuthenticated = payload;
    },
    SET_PROFILE(state: IUserModuleState, payload: any): void {
      state.profile = payload;
    },
  },
  actions: {
    setIsauthenticated(context: IUserModuleContext, payload: boolean): void {
      context.commit('SET_IS_AUTHENTICATED', payload);
    },
    setProfile(context: IUserModuleContext, payload: any): void {
      context.commit('SET_PROFILE', payload);
    },
  },
  getters: {
    isAuthenticated: (state: IUserModuleState) => state.isAuthenticated,
    profile: (state: IUserModuleState) => state.profile,
  },
};

export default userModule;
