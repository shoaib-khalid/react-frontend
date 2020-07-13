import Vue from 'vue';
import Vuex from 'vuex';

import { auth } from './modules/auth';
import { notis } from './modules/notis';

Vue.use(Vuex);

export const store = new Vuex.Store({
    // state: {},
    // getters: {},
    // mutations: {},
    // actions: {},
    modules: {
        auth,
        notis
    }
});