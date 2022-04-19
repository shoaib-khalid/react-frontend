<template>
  <section class="login-block" style="background: #00bcd4">
    <!-- Container-fluid starts -->
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <!-- Authentication card start -->
          <!-- TODO <form @submit.prevent="handleSubmit" class="md-float-material form-material"> -->
          <form
            @submit.prevent="handleSubmit"
            class="md-float-material form-material"
          >
            <div class="text-center">
              <img
                class="img-fluid"
                src="/assets/images/logo.png"
                alt="Theme-Logo"
              />
            </div>
            <div class="auth-box card">
              <div class="card-block">
                <div class="row m-b-20">
                  <div class="col-md-12">
                    <h3 class="text-center">Sign In</h3>
                    <!-- <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div> -->
                  </div>
                </div>
                <div class="form-group form-primary">
                  <v-text-field
                    type="text"
                    v-model="username"
                    v-validate="'required'"
                    name="username"
                    data-vv-name="username"
                    :error-messages="errors.collect('username')"
                    label="Username"
                    focus
                  />
                </div>
                <div class="form-group form-primary">
                  <v-text-field
                    type="password"
                    v-model="password"
                    v-validate="'required'"
                    name="password"
                    data-vv-name="password"
                    :error-messages="errors.collect('password')"
                    label="Password"
                  />
                </div>
                <v-flex xs12 px-4 py-2 class="text-center">
                  <v-btn type="submit" round color="#3498db" dark>Login</v-btn>
                </v-flex>
                <div class="row m-t-25 text-left">
                  <div class="col-12">
                    <!-- <div class="checkbox-fade fade-in-primary d-">
                      <label>
                        <input type="checkbox" value />
                        <span class="cr">
                          <i class="cr-icon icofont icofont-ui-check txt-primary"></i>
                        </span>
                        <span class="text-inverse">Remember me</span>
                      </label>
                    </div>-->
                    <div class="forgot-phone text-center float-center">
                      <a
                        href="javascript:void(0);"
                        @click="resetPassword"
                        class="text-right f-w-600"
                        >Forgot Password?</a
                      >
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </form>
          <!-- end of form -->
        </div>
        <!-- end of col-sm-12 -->
      </div>
      <!-- end of row -->
    </div>
    <!-- end of container-fluid -->
  </section>
</template>
<script>
import Vue from "vue";
import Swal from "sweetalert2";
import utils from "../utils";
import FPUserTypes from "../enums/FPUserTypes";

export default {
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      error: "",
      isTestUser: false,
      baseUrl: utils.getBaseUrl(),
      basePrepaidURL: utils.getBasePrepaidUrl(),
      baseReportURL: utils.getBaseReportUrl(),
    };
  },
  mounted() {
    sessionStorage.removeItem("isTestUser");

    console.log(`BaseUrl: ${this.baseUrl}`);
    console.log(`BaseReportUrl: ${this.baseReportURL}`);
    console.log(`BasePrepaidUrl: ${this.basePrepaidURL}`);
  },
  methods: {
    resetPassword: async function () {
      const { value: email } = await Swal.fire({
        title: "Reset Password",
        text: "please enter your email so we can sent link reset password",
        input: "email",
        inputPlaceholder: "Enter the Email",
        showCancelButton: true,
      });
      if (email) {
        let path = window.location.href.replace(
          this.$route.path,
          "/account/password/reset/"
        );
        Vue.$http
          .post(`${this.baseUrl}/user/resetpassword`, {
            domain: path,
            email: email,
          })
          .then((result) => {
            if (result.errorCode == "00") {
              Swal.fire(
                "Success sent link!",
                `Link already been sent to your email [${email}], please check your inbox!.`,
                "success"
              );
            } else {
              Swal.fire({
                title: "Failed!",
                text: "Failed reset password",
                type: "error",
                confirmButtonText: "Exit",
              });
            }
          });
      }
    },
    loginRequest() {
      if (this.username === "testuser") {
        this.isTestUser = true;
        sessionStorage.setItem("isTestUser", true);
      }

      return Vue.$http.post(`${this.baseUrl}/user/login`, {
        username: this.username,
        password: this.password,
      });
    },
    loadRolePermission(loginInfo) {
      Vue.$http
        .get(`${this.baseUrl}/permission/rolepermission`)
        .then((result) => {
          if (result.errorCode == "00") {
            let role = result.data.find((val) => val.roleId == loginInfo.role);
            let data = {
              role: role ? role.roleId : "ADMIN",
              permissions: role ? role.menuAccess : [],
            };

            if (loginInfo.is_admin) {
              // that.loadCompanyAdminDetail(loginInfo, data);
            } else {
              this.$store.commit("updateRolePermission", data);
            }
          }
        })
        .catch((e) => {
          console.error("Error logging in", e);
        });
    },
    handleSubmit(e) {
      this.submitted = true;
      let that = this;
      const { username, password } = this;
      const { dispatch } = this.$store;

      let loginInfo = {};
      this.$validator.validateAll().then((status) => {
        if (status) {
          this.loginRequest()
            .then((login) => {
              if (login.errorCode == "15") {
                that.$store.commit("notis/setAlert", {
                  type: "warning",
                  title: login.errorDescription,
                  time: "20",
                  message: login.errorMsg,
                });
              } else if (login.errorCode == "00") {
                loginInfo = {
                  is_auth: 1,
                  is_admin: login.data.role == "ADMIN" ? 1 : 0,
                  is_superadmin: login.data.role == "SUPERADMIN" ? 1 : 0,
                  is_changepasswordrequired:
                    login.data.forceChangePassword == 1 ? 1 : 0,
                  token: login.data.authToken,
                  user: {
                    id: login.data.id,
                    name: login.data.name,
                    email: login.data.email,
                    company: login.data.company,
                    username: login.data.username,
                  },
                  role: login.data.role,
                  forceChangePassword: login.data.forceChangePassword,
                  permissions: [],
                };

                dispatch("login", loginInfo);
                //that.loadRolePermission(loginInfo);

                // added below block because there is no role module permission handeled
                //---------------------------------------------------------------------
                let data = {
                  role: login.data.role,
                  permissions: [],
                };
                this.$store.commit("updateRolePermission", data);
                //---------------------------------------------------------------------

                if (loginInfo.forceChangePassword == 1) {
                  this.$router.push({ name: "changePassword" });
                } else if (this.isTestUser) {
                  this.$router.push({ name: "fpUserType" });
                } else {
                  // TODO: Remove for deployment
                  sessionStorage.setItem(
                    FPUserTypes.STORAGE_KEY,
                    FPUserTypes.POSTPAID
                  );
                  this.$router.push({ name: "fpSearch" });
                }
              } else {
                this.$store.commit("notis/setAlert", {
                  type: "error",
                  title: login.errorMsg,
                  time: "4",
                });
              }
            })
            .catch((e) => {
              console.error("Error logging in", e);
            });
        }
      });
    },
    loadCompanyAdminDetail: function (info, data) {
      Vue.$http
        .get(
          `${this.baseUrl}/master/getmasterbycompany/${info.user.company.id}`
        )
        .then((result) => {
          if (result.errorCode == "00") {
            info.user.company.msisdn = null;
            info.user.company.totalBalance = 0;

            if (result.data.length > 0) {
              info.user.company.msisdn = result.data[0].msisdn;
              info.user.company.totalBalance = result.data[0].totalBalance;
            }

            this.$store.commit("updateCompany", {
              msisdn: info.user.company.msisdn,
              totalBalance: info.user.company.totalBalance,
            });

            this.$store.commit("updateRolePermission", data);

            this.$router.push({ name: "fpUserType" });
          }
        });
    },
  },
};
</script>

<style type="text/css" scoped>
section.login-block {
  padding: 30px 0;
  margin: 0 auto;
  background-size: cover;
  min-height: 100vh;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.login-block .auth-box {
  margin: 20px auto 0 auto;
  max-width: 450px;
  padding: 20px;
}

.checkbox-fade .cr,
.checkbox-zoom .cr {
  border-radius: 0;
  border: 2px solid #01a9ac;
  cursor: pointer;
  display: inline-block;
  height: 20px;
  margin-right: 0.5em;
  position: relative;
  width: 20px;
}

.checkbox-fade label input[type="checkbox"],
.checkbox-fade label input[type="radio"] {
  display: none;
}

.checkbox-fade,
.checkbox-zoom {
  display: inline-block;
  margin-right: 15px;
}

.checkbox-fade label {
  line-height: 20px;
}

.checkbox-fade label input[type="checkbox"] + .cr > .cr-icon,
.checkbox-fade label input[type="radio"] + .cr > .cr-icon {
  -webkit-transform: scale(3) rotateZ(-20deg);
  transform: scale(3) rotateZ(-20deg);
  opacity: 0;
  -webkit-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.text-right {
  text-align: right !important;
}
</style>