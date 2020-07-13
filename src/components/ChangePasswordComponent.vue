<template>
  <div class="row m-5">
    <div class="col-md-3"></div>
    <div class="col-md-6">
      <!-- Authentication card start -->
      <form @submit.prevent="handleSubmit" class="md-float-material form-material">
        <div class="card">
          <div class="card-block p-5">
            <div class="row m-b-20">
              <div class="col-md-12">
                <h3 class="text-center">Change Password</h3>
              </div>
            </div>
            <div class="form-group form-primary">
              <v-text-field
                type="password"
                v-model="password"
                v-validate="'required'"
                name="Password"
                data-vv-name="Password"
                :error-messages="errors.collect('Password')"
                label="Password"
                focus
              />
            </div>
            <div class="form-group form-primary">
              <v-text-field
                type="password"
                v-model="newPassword"
                v-validate="'required'"
                name="NewPassword"
                data-vv-name="New Password"
                :error-messages="errors.collect('New Password')"
                label="New Password"
              />
              <div class="form-group form-primary">
                <v-text-field
                  type="password"
                  v-model="confirmPassword"
                  v-validate="`required|confirmed:${newPassword}`"
                  name="ConfirmPassword"
                  data-vv-name="Confirm Password"
                  :error-messages="errors.collect('Confirm Password')"
                  label="Confirm Password"
                />
              </div>
            </div>
            <v-flex xs12 px-4 py-2 class="text-center">
              <v-btn type="submit" round :disabled="changing" color="#3498db" dark>Submit</v-btn>
            </v-flex>
            <hr />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      password: "",
      confirmPassword: "",
      newPassword: "",
      submitted: false,
      error: "",
      changing: false
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    handleSubmit(e) {
      this.$validator.validateAll().then(status => {
        let obj = {
          currentPassword: this.password,
          newPassword: this.newPassword
        };
        Vue.$http.post("/user/changeUserPassword", obj).then(result => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4"
            });
            sessionStorage.setItem("is_changepasswordrequired", 0);
            window.location.href = "/";
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4"
            });
          }
        });
      });
    }
  }
};
</script>
<style type="text/css" scoped>
</style>