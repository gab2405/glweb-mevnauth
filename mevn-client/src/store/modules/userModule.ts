export interface IUserModuleState {
  isLoggedIn: boolean;
}

export interface IUserModuleContext {
  commit: (mutation: string, payload: unknown) => void;
}

const userModule = {
  state: () => ({
    isLoggedIn: false,
  }),
  mutations: {
    SET_IS_LOGGED_IN(state: IUserModuleState, payload: boolean): void {
      state.isLoggedIn = payload;
    },
  },
  actions: {
    setIsLoggedIn(context: IUserModuleContext, payload: boolean): void {
      context.commit('SET_IS_LOGGED_IN', payload);
    },
  },
};

export default userModule;
