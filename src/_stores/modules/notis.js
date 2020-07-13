// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

export const notis = {
    namespaced: true,
    state: {
        alert: {
            title: null,
            status: 0,
            type: 'success',
            message: null,
            icon: '',
            time: 3
        },
        loading: false
    },
    mutations: {
        setAlert: async function(state, data) {
            state.alert = data;

            return await Swal.fire({
              type: state.alert.type,
              title: state.alert.title ? state.alert.title : null,
              text: state.alert.message ? state.alert.message : null,
              // text: state.alert.message,
              timer: state.alert.time * 1000,
            });
        },
        stopAlert: function(state) {
            state.alert.status = 0;
        },
        setConfirm: function(state,data){
            
        },
        setDemo: function(state, data) {
            state.demo = data;
        },
        setLoading : function(state,data){
            state.loading = data;
        }
    },
    actions: {
        success({ commit, state }, object_data) {
            return this.dispatch('notis/alert_set',{'type': 'success','object_data':object_data});
        },
        warning({ commit, state }, object_data) {
            return this.dispatch('notis/alert_set',{'type': 'warning','object_data':object_data});
        },
        error({ commit, state }, object_data) {
            return this.dispatch('notis/alert_set',{'type': 'error','object_data':object_data});
        },
        confirm({ commit, state }) {

            // return new Promise((resolve, reject) => {
            //     return 
            // })
            
        },
        alert_set({ commit, state }, object,obje) {

            let temp_state = state.alert;
            temp_state.type = object.type;
            temp_state.status = 1;

            let message = {
                success:'Successfully executed task!',
                warning:'Something wrong happen!',
                error:'Task Failed!',
            };

            temp_state.message = message[object.type];

            if ("message" in object.object_data) temp_state.message = object.object_data.message;
            if ("icon" in object.object_data) temp_state.icon = object.object_data.icon;
            if ("time" in object.object_data) temp_state.time = object.object_data.time;

            // Swal.fire('Any fool can use a computer')


            commit('setAlert', temp_state);

            // return new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         commit('stopAlert')
            //         resolve()
            //     }, temp_state.time * 1000)
            // })
        },
        action1({ commit }) {
            commit('setDemo', 'demo')
        },
        action2({ commit, state }, object_data) {
            commit('setDemo', 'demo')
        }
    },
    getters: {
        // getDemo: state => {
        //     return state.demo;
        // },
        // getDemoUnderDemo: (state, getters) => {
        //     return getters.getDemo
        // },
        // getTodoById: (state, getters) => (param) => {
        //     return state.demo.find(todo => todo.id === param)
        // }
    }
}