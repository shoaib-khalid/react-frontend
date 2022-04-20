<template>
  <div>
    <div class="card col-sm-12 col-md-8 col-lg-6 p-3">
      <div class="card-block">
        <h5>Create User</h5>
        <form @submit.prevent="handleFpCreateUser">
          <v-layout row wrap>
            <v-flex xs12 px-2 py-1>
              <div class="row">
                <div class="col-sm-4">
                  <span class="text-left numbering mt-4">1.</span>
                  <v-text-field
                    v-model="fpAccount.parentMsisdn"
                    v-validate="'required'"
                    pattern="^\d{11}$"
                    type="text"
                    :error-messages="errors.collect('MSISDN')"
                    data-vv-name="MSISDN"
                    label="Enter MSISDN"
                    disabled
                  ></v-text-field>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 px-2 py-1>
              <div class="row">
                <div class="col-sm-11">
                  <span class="text-left numbering">2.</span>
                  <h5>SELECT ONE OF THE FOLLOWING PLANS:</h5>
                  <v-radio-group
                    class="pl-5"
                    v-validate="'required'"
                    v-model="fpAccount.pricePlanId"
                    :error-messages="errors.collect('Family Plan')"
                    data-vv-name="Family Plan"
                  >
                    <v-radio
                      v-for="familyPlan in familyPlans"
                      :key="familyPlan.id"
                      :value="familyPlan.id"
                    >
                      <template slot="label">
                        <div class="row mt-4">
                          <span class="col-md-12 text-uppercase">{{
                            familyPlan.cbsPlanNameParent
                          }}</span>
                          <span class="col-md-12">
                            Resources :
                            <span
                              :key="'product' + i"
                              v-for="(product, i) in familyPlan.productList"
                            >
                              <span v-if="product.isShareable != 2">
                                <span v-if="i != 0">,</span>
                                <!-- {{ (product.productInfo.quotaUnit=='BYTE' ? formatBytes(product.amount): product.amount) +' '+ product.productInfo.productName.replace("Internet", "MBs") }} -->
                                {{
                                  getProductValue(product) +
                                  " " +
                                  product.productInfo.productName.replace(
                                    "Internet",
                                    "MBs"
                                  )
                                }}
                              </span>
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 px-4 py-2 class="text-right">
              <v-btn
                ref="refTosubmit"
                type="submit"
                round
                :disabled="loading"
                color="#3498db"
                dark
                >Submit</v-btn
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
import utils from "../utils";

export default {
  data: () => ({
    fpAccount: {
      parentMsisdn: "",
      pricePlanId: undefined,
    },
    familyPlans: [],
    loading: false,
    submitted: false,
    baseUrl: utils.getBaseUrl(),
  }),
  methods: {
    handleFpCreateUser() {
      this.submitted = true;
      let _this = this;

      this.$validator.validateAll().then((status) => {
        if (status) {
          Vue.$http
            .post(this.baseUrl + "/parent/provisionParent", this.fpAccount)
            .then((result) => {
              if (result.errorCode == "00") {
                this.$store.commit("notis/setAlert", {
                  type: "success",
                  title: result.errorMsg,
                  time: "4",
                });
                _this.$router.push({ name: "parentProfile" });
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
    getFPPricePlan: function () {
      Vue.$http
        .post(this.baseUrl + "/general/getFPPricePlan", {})
        .then((result) => {
          if (result.errorCode == "00") {
            this.familyPlans = result.data;
            this.fpAccount.pricePlanId = this.familyPlans[0].id;
          }
        });
    },
    getProductValue(product) {
      if (product.productInfo.quotaUnit == "BYTE") {
        return this.formatBytes(product.amount);
      } else if (product.productInfo.quotaUnit == "SECOND") {
        return utils.convertSecondsToMins(product.amount);
      } else {
        return product.amount;
      }
    },
    formatBytes(bytes) {
      return utils.formatBytes(bytes);
    },
  },
  created() {},
  computed: {},
  mounted() {
    this.fpAccount.parentMsisdn = sessionStorage.getItem("ParentMSISDN")
      ? sessionStorage.getItem("ParentMSISDN")
      : undefined;
    this.getFPPricePlan();
    this.$nextTick(() => this.$refs.refTosubmit.$el.focus());
  },
};
</script>
<style scoped>
.numbering {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 15px;
  font-size: 1.3rem;
  padding-left: 10px;
}
.card {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
}
</style>
