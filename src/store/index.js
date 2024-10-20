import { createStore } from 'vuex';

export default createStore({
  state: {
    user_id: null,
  },
  mutations: {
    setUserId(state, user_id) {
      state.user_id = user_id;
    },
  },
});
