
export const auth = {
    // namespaced: true,
    state: {
        is_auth: sessionStorage.getItem('is_auth') ? +sessionStorage.getItem('is_auth') : 0,
        is_admin: sessionStorage.getItem('is_admin') ? +sessionStorage.getItem('is_admin') : 0,
        is_superadmin: sessionStorage.getItem('is_superadmin') ? +sessionStorage.getItem('is_superadmin') : 0,
        is_changepasswordrequired: sessionStorage.getItem('is_changepasswordrequired') ? +sessionStorage.getItem('is_changepasswordrequired') : 0,
        token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null,
        user: sessionStorage.getItem('user') !== "undefined" || sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {
            id: null,
            name: '',
            email: '',
            company: null,
            username: ''
        },
        role: sessionStorage.getItem('role') ? sessionStorage.getItem('role') : null,
        permissions: sessionStorage.getItem('permissions') !== "undefined" || sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')) : []
    },
    mutations: {
        reSetChangePasswordRequired(state, data) {
            state.is_changepasswordrequired = data;
        },
        login: function (state, data) {
            // console.log("data",data);
            // sessionStorage.clear();

            // state = {
            //     is_admin: data.is_admin
            // }
            // state.is_auth = data.is_auth;
            state.is_admin = data.is_admin;
            state.is_superadmin = data.is_superadmin;
            state.is_changepasswordrequired = data.is_changepasswordrequired;
            state.token = data.token;
            state.user = data.user;
            state.role = data.role;
            state.permissions = data.permissions;

            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            sessionStorage.setItem('is_auth', data.is_auth);
            sessionStorage.setItem('is_admin', data.is_admin);
            sessionStorage.setItem('is_superadmin', data.is_superadmin);
            sessionStorage.setItem('is_changepasswordrequired', data.is_changepasswordrequired);
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('role', data.role);
            sessionStorage.setItem('permissions', JSON.stringify(data.permissions));

            // console.log("state",state);


        },
        updatePermissionByRole: function (state, data) {
            sessionStorage.setItem('permissions', JSON.stringify(data.permissions));

            // console.log(sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')) : []);

        },
        updateRolePermission: function (state, data) {
            sessionStorage.setItem('role', data.role);
            sessionStorage.setItem('permissions', JSON.stringify(data.permissions));

            state.is_auth = 1;
            state.role = data.role;
            state.permissions = data.permissions;

        },
        updateCompany: function (state, data) {
            // let user = state.user;

            state.user.company.msisdn = data.msisdn;
            state.user.company.totalBalance = data.totalBalance;

            sessionStorage.setItem('user', JSON.stringify(state.user));
            console.log(state);
        },
        logout: function (state) {
            debugger;
            state.is_auth = 0;
            state.is_admin = 0;
            state.is_superadmin = 0;
            state.token = null;
            state.role = null;
            state.permissions = [];
            state.user = {
                id: null,
                name: '',
                email: '',
                company: null,
                username: ''
            };

            sessionStorage.clear();
        }
    },
    actions: {
        login({ commit, state }, object_data) {
            // console.log("object_data",object_data);
            commit('login', object_data);
        }
    },
    getters: {
        getIsAuth: state => {
            return state.is_auth;
        },
        getIsToken: state => {
            return state.token;
        },
        getIsAdmin: state => {
            return state.is_admin;
        },
        getIsSuperadmin: state => {
            return state.is_superadmin;
        },
        getUser: state => {
            return state.user;
        },
        getRole: state => {
            return state.role;
        },
        getPermissions: state => {
            return state.permissions;
        },
        getChangePasswordRequired: state => {
            return state.is_changepasswordrequired;
        }
    }
}