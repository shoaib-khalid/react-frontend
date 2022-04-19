<template>
  <div>
    <div class="card p-3">
      <div class="card-block">
        <h5>Add User</h5>
        <form>
          <v-layout row wrap>
            <v-flex xs12 px-4 py-1>
              <v-text-field
                v-model="account.email"
                v-validate="'required|email'"
                type="email"
                :error-messages="errors.collect('email')"
                data-vv-name="email"
                label="Email"
                @keypress="AvoidSpace($event)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 px-4 py-1>
              <v-text-field
                v-model="account.name"
                data-vv-name="name"
                :error-messages="errors.collect('name')"
                v-validate="'required'"
                type="text"
                label="Name"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 px-4 py-1>
              <v-text-field
                v-model="account.username"
                data-vv-name="username"
                :error-messages="errors.collect('username')"
                v-validate="'required'"
                type="text"
                label="Username"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 px-4 py-1>
              <v-text-field
                v-model="account.password"
                ref="password"
                data-vv-name="account.password"
                :error-messages="errors.collect('account.password')"
                v-validate="'required'"
                type="password"
                label="Password"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 px-4 py-1>
              <v-text-field
                v-model="account.rpassword"
                data-vv-name="confirmation_password"
                :error-messages="errors.collect('confirmation_password')"
                v-validate="`required|confirmed:${account.password}`"
                type="password"
                label="Confirmation Password"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 px-4 py-1>
              <v-autocomplete
                v-model="account.role"
                item-value="roleId"
                item-text="roleName"
                :items="roles"
                label="Roles"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 px-4 py-2 class="text-right">
              <v-btn
                round
                @click="handleSubmit"
                :disabled="loading"
                color="#3498db"
                dark
                >Add User</v-btn
              >
            </v-flex>
          </v-layout>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import utils from "../../utils";

export default {
  // props: ['userId'],
  data: () => ({
    baseUrl: utils.getBaseUrl(),
    company_list: [],
    roles: [],
    account: {
      email: "",
      name: "",
      username: "",
      password: "",
      rpassword: "",
      company_id: "",
      channel: "WEB",
      role: null,
    },
    loading: false,
    submitted: false,
  }),
  methods: {
    AvoidSpace(event) {
      var k = event ? event.which : window.event.keyCode;
      if (k == 32) {
        event.preventDefault();
        return false;
      }
    },
    handleSubmit() {
      this.submitted = true;
      this.$validator.validateAll().then((status) => {
        if (status) {
          Vue.$http
            .post(`${this.baseUrl}/user/addUser`, this.account)
            .then((result) => {
              if (result.errorCode == "00") {
                this.$store.commit("notis/setAlert", {
                  type: "success",
                  title: result.errorMsg,
                  time: "4",
                });
                this.$router.push({ name: "user.list" });
              } else {
                this.$store.commit("notis/setAlert", {
                  type: "error",
                  title: result.errorMsg,
                  time: "4",
                });
              }
            });
        }
      });
    },
    loadRolePermission() {
      let that = this;
      Vue.$http
        .post(`${this.baseUrl}/permission/getRole`, {})
        .then((result) => {
          if (result.errorCode == "00") {
            that.roles = result.data;
          }
        });
    },
  },
  mounted() {
    this.loadRolePermission();
  },
};
</script>
<style>
</style>