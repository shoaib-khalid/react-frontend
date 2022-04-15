<template>
  <div>
    <!-- Basic Form Inputs card start -->
    <div class="card col-md-4 p-3">
      <div class="card-block">
        <div v-if="!createNewFF && !requestPending">
          <div>
            <v-btn @click="goBack" color="#3498db" dark id="back-button">
              <v-icon dark left>arrow_back</v-icon>
              Back
            </v-btn>
          </div>
          <h5>FP Search</h5>
          <form @submit.prevent="handleFpSearch">
            <v-layout row wrap>
              <v-flex xs12 px-5 py-5>
                <v-text-field
                  v-model="fpSearch.userMsisdn"
                  v-validate="'required'"
                  pattern="^\d{11}$"
                  v-mask="'###########'"
                  type="text"
                  :error-messages="errors.collect('MSISDN')"
                  data-vv-name="MSISDN"
                  label="Enter MSISDN"
                  @keypress="IsNumber($event)"
                  autofocus
                ></v-text-field>
                <v-btn-toggle v-model="userStatus">
                  <v-btn flat value="parent">Parent</v-btn>
                  <v-btn flat value="child">Child</v-btn>
                </v-btn-toggle>
              </v-flex>
              <v-flex xs12 px-4 py-2 class="text-right">
                <v-btn
                  type="submit"
                  round
                  :disabled="loading"
                  color="#3498db"
                  dark
                >
                  Find
                </v-btn>
              </v-flex>
            </v-layout>
          </form>
        </div>
        <v-layout row wrap v-if="createNewFF">
          <v-flex xs12 px-5 py-5 class="text-center">
            <p class="lead">
              {{
                fpSearch.userMsisdn.substring(0, 4) +
                " " +
                fpSearch.userMsisdn.substring(4, 11)
              }}
              is not a {{ selectedFpUserType }} Family Plan User
            </p>
          </v-flex>
          <v-flex xs12 px-4 py-2 class="text-center">
            <v-btn
              @click="CancelCreateUser()"
              type="button"
              style="width: 120px"
              class="mr-2"
              round
              :disabled="loading"
              color="#e74c3c"
              dark
              >Cancel</v-btn
            >
            <v-btn
              @click="handleCreateNewFPU"
              ref="refToCreateNew"
              round
              :disabled="loading"
              color="#3498db"
              dark
              style="width: 120px"
              >Create User</v-btn
            >
          </v-flex>
        </v-layout>
        <v-layout row wrap v-if="requestPending">
          <v-flex xs12 px-5 py-5 class="text-center">
            <p class="lead">Subscription request sent, Check back later.</p>
          </v-flex>
          <v-flex xs12 px-4 py-2 class="text-center">
            <v-btn
              @click="handleSubscriptionRequestSent"
              ref="refToSubscriptionRequestSent"
              round
              :disabled="loading"
              color="#3498db"
              dark
              >OK</v-btn
            >
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import Vue from "vue";
import utils from "../utils";
import FPUserTypes from "../enums/FPUserTypes";
import ApiUrls from "../enums/ApiUrls";

export default {
  data: () => ({
    fpSearch: {
      userMsisdn: "",
    },
    loading: false,
    submitted: false,
    createNewFF: false,
    requestPending: false,
    fpUserTypes: FPUserTypes,
    selectedFpUserType: "",
    userStatus: "parent",
    baseUrl: "",
    basePrepaidUrl: "",
  }),
  methods: {
    handleFpSearch() {
      this.submitted = true;
      let _this = this;
      this.$validator.validateAll().then((status) => {
        if (status) {
          switch (this.selectedFpUserType) {
            case _this.fpUserTypes.PREPAID:
              this.resolveMsisdnPrepaid(_this);
              break;
            case _this.fpUserTypes.POSTPAID:
              console.log("Querying postpaid user");
              this.resolveMsisdnPostpaid(_this);
              break;
            default:
              this.goBack();
          }
        }
      });
    },
    resolveMsisdnPrepaid(_this) {
      // TODO: Uncomment
      const parentMsisdn = _this.fpSearch.userMsisdn;
      // const parentMsisdn = "03005438062";
      Vue.$http
        .get(
          `${this.basePrepaidURL}/user/getSubscriberType?parentMsisdn=${parentMsisdn}`
        )
        .then(
          (result) => {
            console.log(result);
            if (result === "Prepaid") {
              sessionStorage.setItem("ParentMSISDN", parentMsisdn);
              _this.$router.push({ name: "prepaidParentProfile" });
            } else {
              // TODO: Give option to create prepaid subscriber
              this.$store.commit("notis/setAlert", {
                type: "error",
                title: "Not a subscriber",
                time: "4",
              });
            }
          },
          (error) => {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: error,
              time: "4",
            });
          }
        );
    },
    resolveMsisdnPostpaid(_this) {
      Vue.$http
        .post(`${this.baseUrl}/parent/getMsisdnStatus`, _this.fpSearch)
        .then((result) => {
          if (result.errorCode == "00") {
            if (result.data.status == "NEW") {
              sessionStorage.setItem("ParentMSISDN", this.fpSearch.userMsisdn);
              _this.createNewFF = true;
              _this.requestPending = false;
              _this.$nextTick(() => _this.$refs.refToCreateNew.$el.focus());
            } else if (result.data.status == "PENDING") {
              _this.createNewFF = false;
              _this.requestPending = true;
              _this.$nextTick(() =>
                _this.$refs.refToSubscriptionRequestSent.$el.focus()
              );
            } else if (
              result.data.status == "SUSPENDED" ||
              result.data.status == "BLOCKED" ||
              result.data.status == "PP_BLACKLISTED"
            ) {
              this.$store.commit("notis/setAlert", {
                type: "error",
                title: "Nmber is " + result.data.status.replace("PP_", ""),
                time: "4",
              });
            } else if (result.data.type == "PARENT") {
              sessionStorage.setItem("ParentMSISDN", this.fpSearch.userMsisdn);
              _this.$router.push({ name: "parentProfile" });
            } else if (result.data.type == "CHILD") {
              sessionStorage.setItem("ParentMSISDN", result.data.parentMsisdn);
              sessionStorage.setItem("ChildMSISDN", this.fpSearch.userMsisdn);
              _this.$router.push({ name: "childProfile" });
            }
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4",
            });
          }
        });
    },
    handleCreateNewFPU() {
      if (this.selectedFpUserType === this.fpUserTypes.POSTPAID) {
        let msisdn = sessionStorage.getItem("ParentMSISDN");
        let obj = {
          parentMsisdn: msisdn,
        };
        Vue.$http
          .post(`${this.baseUrl}/parent/isMsisdnEligibleForFP`, obj)
          .then((result) => {
            if (result.errorCode == "00") {
              if (result.data.isSubscribed) {
                this.provisionParent();
              } else {
                this.$router.push({ name: "createfpuser" });
              }
            } else {
              this.$store.commit("notis/setAlert", {
                type: "error",
                title: result.errorMsg,
                time: "4",
              });
            }
          });
      } else {
        // TODO: Implement logic for creating Prepaid FP User
      }
    },
    provisionParent() {
      let msisdn = sessionStorage.getItem("ParentMSISDN");
      let obj = {
        parentMsisdn: msisdn,
        pricePlanId: "",
      };
      Vue.$http
        .post(`${this.baseUrl}/parent/provisionParent`, obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4",
            });
            this.$router.push({ name: "parentProfile" });
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4",
            });
          }
        });
    },
    handleSubscriptionRequestSent() {
      this.fpSearch.userMsisdn = "";
      this.createNewFF = false;
      this.requestPending = false;
    },
    IsNumber(evt) {
      return utils.isNumber(evt);
    },
    CancelCreateUser() {
      sessionStorage.removeItem("ParentMSISDN");
      this.fpSearch.userMsisdn = "";
      this.createNewFF = false;
      this.requestPending = false;
    },
    goBack() {
      this.$router.push({ name: "fpUserType" });
    },
  },
  mounted() {
    this.baseURL = utils.getBaseUrl();
    this.basePrepaidURL = utils.getBasePrepaidUrl();
    this.selectedFpUserType = sessionStorage.getItem(
      this.fpUserTypes.STORAGE_KEY
    );
    if (!this.selectedFpUserType) {
      this.goBack();
    }
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.card {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
}

#back-button {
  margin-bottom: 1rem;
  margin-left: 0;
}
</style>
