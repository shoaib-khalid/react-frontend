export const _alert_mod = {
    state: {
        demo: null
    },
    mutations: {
        setDemo: function(state, data) {
            state.demo = data;
        }
    },
    actions: {
        action1({ commit }) {
            commit('setDemo', 'demo')
        },
        action2({ commit, state }, object_data) {
            commit('setDemo', 'demo')
        }
    },
    getters: {
        getDemo: state => {
            // return state.is_auth;
        },
        getDemoUnderDemo: (state, getters) => {
            return getters.getDemo
        },
        getTodoById: (state, getters) => (param) => {
            return state.demo.find(todo => todo.id === param)
        }
    }
}