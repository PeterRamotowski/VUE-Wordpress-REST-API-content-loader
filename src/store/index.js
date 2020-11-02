import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      data: {},
      wpurl: '',
      apiRoutes: [],
      loading: false,
      checkedUrls: JSON.parse(localStorage.getItem('checkedUrls')) || [],
    }
  },
  actions: {
    setWpUrl ({ commit }, data) {
      commit('SET_WP_URL', data);
    },
    setApiRoutes ({ commit }, data) {
      commit('SET_API_ROUTES', data);
    },
    setApiRouteCount ({ commit }, data) {
      commit('SET_API_ROUTE_COUNT', data);
    },
    setLoading ({ commit }, data) {
      commit('SET_LOADING', data);
    },
    setCheckedUrls ({ commit }, data) {
      commit('SET_CHECKED_URLS', data);
    },
  },
  mutations: {
    SET_WP_URL (state, wpurl) {
      state.wpurl = wpurl;
    },
    SET_API_ROUTES (state, data) {
      let apiRoutes = [];
      let index = 0;
      Object.values(data).forEach(
        value => {
          if (!value.rest_base.includes('block') &&
              !value.rest_base.includes('menu')) {
                apiRoutes.push({
                  index: index,
                  name: value.name,
                  type: value.rest_base,
                  count: 0
                });
                index++;
          }
        }
      )
      state.apiRoutes = apiRoutes;
    },
    SET_API_ROUTE_COUNT (state, { count, index }) {
      state.apiRoutes[index].count = count;
    },
    SET_LOADING (state, loading) {
      state.loading = loading;
    },
    SET_CHECKED_URLS (state, url) {
      if (!state.checkedUrls.includes(url)) {
        state.checkedUrls.unshift(url);
      }
      localStorage.setItem('checkedUrls', JSON.stringify(state.checkedUrls));
    },
  },
  getters: {
    wpurl: state => state.wpurl,
    apiRoutes: state => state.apiRoutes,
    loading: state => state.loading,
    checkedUrls: state => state.checkedUrls.length ? state.checkedUrls : JSON.parse(localStorage.getItem('checkedUrls')),
  },
})
