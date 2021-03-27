const mutations = {
  // root
  CLEAR_STATE: 'CLEAR_STATE',
  POP_STATE: 'POP_STATE',
}

const actions = {
  // account
  LOAD_ACCOUNT: 'LOAD_ACCOUNT',
}

const getters = {
  // root
  isLoggedIn: 'isLoggedIn',
  token: 'token',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
