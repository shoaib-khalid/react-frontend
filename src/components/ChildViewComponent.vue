<template>
  <div class="col-sm-12 col-md-12 col-lg-12">
    <div class="card">
      <div class="card-block">
        <v-tabs left>
          <v-tab>Child Profile</v-tab>
          <div class="v-tabs__div">
            <a
              @click="goToParentProfile()"
              class="v-tabs__item v-tabs__item--active"
              style="position: static"
              >Main User</a
            >
          </div>
          <v-tab-item :key="'tabChildProfile'">
            <v-container fluid>
              <div class="row">
                <div class="col-md-3">
                  <div class="col-md-12">
                    <h3>User Profile</h3>
                  </div>
                  <div class="col-md-12 mt-3">
                    <span>MSISDN: {{ childAccount.childProfile.msisdn }}</span>
                  </div>
                  <div class="col-md-12 mt-3">
                    <span
                      >SEGMENT: {{ childAccount.childProfile.subType }}</span
                    >
                  </div>
                  <div class="col-md-12 mt-3">
                    <span
                      >PRICE PLAN:
                      {{ childAccount.childProfile.originalPricePlan }}</span
                    >
                  </div>
                  <div class="col-md-12 mt-3">
                    <v-btn
                      v-if="childAccount.childProfile.status == 'ACTIVE'"
                      type="button"
                      round
                      :disabled="loading"
                      @click="UnsubscribeChild(childAccount)"
                      color="rgb(254,173,33)"
                      >Unsubscribe</v-btn
                    >

                    <v-btn
                      v-if="
                        childAccount.childProfile.status == 'PENDING_CBS' ||
                        childAccount.childProfile.status == 'CBS_NOT_UPDATE'
                      "
                      type="button"
                      round
                      :disabled="loading"
                      @click="terminateChild(childAccount)"
                      color="rgb(254,173,33)"
                      >Terminate</v-btn
                    >
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="table-responsive mt-3">
                    <table
                      class="table table-bordered table-striped small"
                      v-if="
                        childAccount &&
                        ((childAccount.childMonthlyBalance &&
                          childAccount.childMonthlyBalance.length > 0) ||
                          (childAccount.childOneTimeBalance &&
                            childAccount.childOneTimeBalance.length > 0))
                      "
                    >
                      <tbody>
                        <tr class="table-primary">
                          <th>Allocated Resource</th>
                          <th>Remaining Resources</th>
                          <th>Type</th>
                          <th>Allocation Date</th>
                          <th>Expiry Date</th>
                        </tr>
                        <tr
                          :key="'product_alo' + i"
                          v-for="(
                            product, i
                          ) in childAccount.childMonthlyBalance"
                        >
                          <td>{{ getTotalQuota(product) }}</td>
                          <td>{{ getRemainingQuota(product) }}</td>
                          <td>Monthly Sharing</td>
                          <td>{{ product.applyDate | formatDate }}</td>
                          <td>{{ product.expiryDate | formatDate }}</td>
                        </tr>
                        <tr
                          :key="'product_rem' + i"
                          v-for="(
                            product, i
                          ) in childAccount.childOneTimeBalance"
                        >
                          <td>{{ getTotalQuota(product) }}</td>
                          <td>{{ getRemainingQuota(product) }}</td>
                          <td>One Time Bundle Sharing</td>
                          <td>{{ product.applyDate | formatDate }}</td>
                          <td>{{ product.expiryDate | formatDate }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-12">
                  <div class="table-responsive">
                    <table
                      class="table table-bordered table-striped small"
                      v-if="
                        childTransactionDetails &&
                        childTransactionDetails.length > 0
                      "
                    >
                      <tbody>
                        <tr class="table-primary">
                          <th>Parent Number</th>
                          <th>Child Number</th>
                          <th>Subscriber Type</th>
                          <th>Activity Type</th>
                          <th>Event Type</th>
                          <th>Date & Time</th>
                          <th>Request Channel</th>
                          <th>System Id</th>
                          <th>Resources Type</th>
                          <th>Quota Allocated</th>
                          <th>Old Price Plan</th>
                          <th>New Price Plan</th>
                          <th>Event Status</th>
                          <th>Updated Child Resources</th>
                          <th>Updated Parents Resources</th>
                          <th>TransactionId</th>
                        </tr>
                        <tr
                          :key="'childTransactionDetail' + k"
                          v-for="(
                            childTransactionDetail, k
                          ) in childTransactionDetails"
                        >
                          <td>
                            {{
                              childTransactionDetail.transactionDetails
                                .parentDetails
                                ? childTransactionDetail.transactionDetails
                                    .parentDetails.msisdn
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.transactionDetails
                                .childDetails
                                ? childTransactionDetail.transactionDetails
                                    .childDetails.msisdn
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              IsParentOpCode(
                                childTransactionDetail.transactionDetails
                                  .opcodeDetails.opcode
                              )
                                ? "PARENT"
                                : "CHILD"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.transactionDetails
                                .opcodeDetails.description
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.eventDetails
                                .eventDescription
                            }}
                          </td>
                          <td>{{ childTransactionDetail.created }}</td>
                          <td>
                            {{
                              childTransactionDetail.transactionDetails.channel
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.transactionDetails
                                .userDetails
                                ? childTransactionDetail.transactionDetails
                                    .userDetails.username
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.productDetails
                                ? childTransactionDetail.productDetails
                                    .productName
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.convertedAllocationAmount
                                ? childTransactionDetail.convertedAllocationAmount
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.oldPricePlan
                                ? childTransactionDetail.oldPricePlan
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.newPricePlan
                                ? childTransactionDetail.newPricePlan
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.eventStatus
                                ? childTransactionDetail.eventStatus
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.convertedNewChildBalance
                                ? childTransactionDetail.convertedNewChildBalance
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.convertedNewParentBalance
                                ? childTransactionDetail.convertedNewParentBalance
                                : "NA"
                            }}
                          </td>
                          <td>
                            {{
                              childTransactionDetail.transactionDetails
                                .systemTransactionId
                                ? childTransactionDetail.transactionDetails
                                    .systemTransactionId
                                : "NA"
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import Vue from "vue";
import utils from "../utils";

export default {
  data: () => ({
    childAccount: {
      childProfile: {
        pricePlanDetails: {},
      },
    },
    mainAccount: {
      parentProfile: {},
    },
    parentMsisdn: "",
    childMsisdn: "",
    loading: false,
    submitted: false,
    childTransactionDetails: [],
    baseUrl: utils.getBaseUrl(),
  }),
  methods: {
    getTotalQuota(product) {
      let value = "";
      if (product.productDetails.quotaUnit == "BYTE") {
        value =
          this.formatBytes(product.totalQuota) +
          " " +
          product.productDetails.productName.replace("Internet", "MBs");
      } else if (product.productDetails.quotaUnit == "SECOND") {
        value =
          utils.convertSecondsToMins(product.totalQuota) +
          " " +
          product.productDetails.productName;
      } else {
        value = product.totalQuota + " " + product.productDetails.productName;
      }
      return value;
    },
    getRemainingQuota(product) {
      let value = "";
      if (product.productDetails.quotaUnit == "BYTE") {
        value =
          this.formatBytes(product.remainingQuota) +
          " " +
          product.productDetails.productName.replace("Internet", "MBs");
      } else if (product.productDetails.quotaUnit == "SECOND") {
        value =
          utils.convertSecondsToMins(product.remainingQuota) +
          " " +
          product.productDetails.productName;
      } else {
        value =
          product.remainingQuota + " " + product.productDetails.productName;
      }
      return value;
    },
    getChildProfile() {
      return new Promise((resolve) => {
        let obj = { childMsisdn: this.childMsisdn };
        Vue.$http
          .post(this.baseUrl + "/child/getChildProfile", obj)
          .then((result) => {
            if (result.errorCode == "00") {
              this.childAccount = result.data;
              resolve();
            }
          });
      });
    },
    getMainProfile() {
      let _this = this;
      let obj = { parentMsisdn: this.parentMsisdn };
      Vue.$http
        .post(this.baseUrl + "/parent/getParentProfile", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            _this.mainAccount = result.data;
          }
        });
    },
    formatBytes(bytes) {
      return utils.formatBytes(bytes);
    },
    goToParentProfile() {
      this.$router.push({ name: "parentProfile" });
    },
    UnsubscribeChild(child) {
      if (child.childProfile.subType == "PREPAID") {
        this.unsubprepaid(child);
      } else {
        this.unsubpostpaid(child);
      }
    },

    terminateChild(child) {
      Swal.fire({
        text: "ARE YOU SURE YOU WANT TO TERMINATE?",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#e74c3c",
        customClass: "swal-wide",
        confirmButtonText: "YES",
        reverseButtons: true,
        cancelButtonText: "NO",
      }).then((result) => {
        if (result.value) {
          let _childToUnsub = {
            parentMsisdn: this.parentMsisdn,
            childMsisdn: this.childMsisdn,
          };
          Vue.$http
            .post(
              this.baseUrl + "/child/terminateCrmPendingChild",
              _childToUnsub
            )
            .then((result) => {
              if (result.errorCode == "00") {
                this.$store.commit("notis/setAlert", {
                  type: "success",
                  title: result.errorMsg,
                  time: "4",
                });
              } else
                this.$store.commit("notis/setAlert", {
                  type: "error",
                  title: result.errorMsg,
                  time: "4",
                });
            });
        }
      });
    },

    unsubprepaid(child) {
      Swal.fire({
        text: "ARE YOU SURE YOU WANT TO UNSUBSCRIBE?",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#e74c3c",
        customClass: "swal-wide",
        confirmButtonText: "YES",
        reverseButtons: true,
        cancelButtonText: "NO",
      }).then((result) => {
        if (result.value) {
          let _childToUnsub = {
            parentMsisdn: this.parentMsisdn,
            childMsisdn: this.childMsisdn,
          };
          Vue.$http
            .post(this.baseUrl + "/child/unsubChild", _childToUnsub)
            .then((result) => {
              if (result.errorCode == "00") {
                this.$store.commit("notis/setAlert", {
                  type: "success",
                  title: result.errorMsg,
                  time: "4",
                });
              } else
                this.$store.commit("notis/setAlert", {
                  type: "error",
                  title: result.errorMsg,
                  time: "4",
                });
            });
        }
      });
    },
    unsubpostpaid() {
      Swal.fire({
        title: "ARE YOU SURE YOU WANT TO UNSUBSCRIBE?",
        input: "select",
        inputOptions: this.getOtherPricePlan(),
        inputPlaceholder: "SELECT OTHER PLAN",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#e74c3c",
        customClass: "swal-wide",
        confirmButtonText: "UNSUBSCRIBE",
        reverseButtons: true,
        cancelButtonText: "CANCEL",
        inputValidator: (value) => {
          return new Promise((resolve) => {
            let _childToUnsub = undefined;
            if (value) {
              _childToUnsub = {
                parentMsisdn: this.parentMsisdn,
                childMsisdn: this.childMsisdn,
                newPricePlanId: value,
              };
            } else {
              _childToUnsub = {
                parentMsisdn: this.parentMsisdn,
                childMsisdn: this.childMsisdn,
              };
            }
            Vue.$http
              .post(this.baseUrl + "/child/unsubChild", _childToUnsub)
              .then((result) => {
                if (result.errorCode == "00") {
                  this.$store.commit("notis/setAlert", {
                    type: "success",
                    title: result.errorMsg,
                    time: "4",
                  });
                } else
                  this.$store.commit("notis/setAlert", {
                    type: "error",
                    title: result.errorMsg,
                    time: "4",
                  });
              });
            resolve();
          });
        },
      });
    },
    getOtherPricePlan() {
      return new Promise((resolve) => {
        let param = {
          parentMsisdn: this.parentMsisdn,
          typeOfPricePlan: "PREPAID",
        };
        Vue.$http
          .post(this.baseUrl + "/general/getOtherPricePlan", param)
          .then((result) => {
            if (result.errorCode == "00") {
              var obj = {};
              result.data.forEach((element) => {
                obj[element.id] = element.name;
              });
              resolve(obj);
            }
          });
      });
    },
    getChildTransactionDetails() {
      let obj = {
        childId: this.childAccount.childProfile.id,
        startDate: "",
        endDate: "",
        opcodeId: "",
      };
      Vue.$http
        .post(this.baseUrl + "/transaction/getChildEventDetails", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.childTransactionDetails = result.data;
          }
        });
    },
    IsParentOpCode(opcode) {
      if (
        ["ADD_PARENT", "REMOVE_PARENT", "CHANGE_PRICE_PLAN"].includes(opcode)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.parentMsisdn = sessionStorage.getItem("ParentMSISDN")
      ? sessionStorage.getItem("ParentMSISDN")
      : undefined;
    this.childMsisdn = sessionStorage.getItem("ChildMSISDN")
      ? sessionStorage.getItem("ChildMSISDN")
      : undefined;

    this.getChildProfile().then(() => {
      this.getChildTransactionDetails();
    });
    this.getMainProfile();
  },
};
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.card {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
}
</style>






