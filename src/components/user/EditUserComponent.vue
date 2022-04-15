<template>
  <div>
    <!-- Basic Form Inputs card start -->
    <div class="card p-3">
      <div class="card-block">
        <h5>Edit User</h5>
        <form @submit.prevent="handleSubmit">
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">
              Email
              <span class="text-danger">*</span>
            </label>
            <div class="col-sm-10 pull-right">
              <input
                type="text"
                class="form-control"
                name="email"
                v-validate="'required|email'"
                v-model="user.email"
                :class="{ 'is-invalid': submitted && errors.has('email') }"
              />
              <div
                v-if="submitted && errors.has('email')"
                class="invalid-feedback"
              >
                {{ errors.first("email") }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">
              Full Name
              <span class="text-danger">*</span>
            </label>
            <div class="col-sm-10 pull-right">
              <input
                type="text"
                class="form-control"
                name="name"
                v-validate="'required'"
                v-model="user.name"
                :class="{ 'is-invalid': submitted && errors.has('name') }"
              />
              <div
                v-if="submitted && errors.has('name')"
                class="invalid-feedback"
              >
                {{ errors.first("name") }}
              </div>
            </div>
          </div>
          <hr />
          <div class="form-group row">
            <div class="col-sm-5 col-sm-offset-2">
              <button :disabled="loading" class="btn btn-primary">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import utils from "../../utils";

export default {
  props: ["id"],
  data: () => ({
    baseUrl: "",
    user: {
      id: "",
      name: "",
      email: "",
    },
    loading: false,
    submitted: false,
  }),
  methods: {
    handleSubmit(e) {
      this.submitted = true;
      this.$validator.validate().then((valid) => {
        if (valid) {
          this.loading = true;
          this.submitted = true;
          Vue.$http
            .post(`${this.getBaseUrl}/user/updateUser`, this.user)
            .then((result) => {
              if (result.errorCode == "00") {
                this.$store.commit("notis/setAlert", {
                  type: "success",
                  title: result.errorMsg,
                  time: "4",
                });
                this.$router.push({ name: "user" });
              } else {
                this.$store.commit("notis/setAlert", {
                  type: "error",
                  title: result.errorMsg,
                  time: "4",
                });
              }
            });
        } else {
          console.log(valid);
        }
      });
    },
    loadUserInfo: function () {
      let obj = {
        id: this.$route.params.id,
      };
      Vue.$http
        .post(`${this.getBaseUrl}/user/getUserDetails`, obj)
        .then((result) => {
          this.user.id = result.data.id;
          this.user.name = result.data.name;
          this.user.email = result.data.email;
        });
    },
  },
  mounted() {
    this.baseUrl = utils.getBaseUrl();
    if (this.$route.params.id) this.loadUserInfo();
    else {
      this.$router.push({ name: "user" });
    }
  },
};
</script>
<style>
</style>