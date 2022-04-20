<template>
  <div class="row" :key="userHistoryComponentKey">
    <div class="col-md-12">
      <div class="table-responsive border">
        <table class="table table-striped small">
          <thead>
            <tr style="height: 60px" class="table-primary">
              <th width="30%" class="align-middle" style="min-width: 235px">
                FAMILY PLAN STATUS
              </th>
              <td width="10%" class="align-middle">{{ familyPlanStatus }}</td>
              <td class="align-middle">
                <v-btn
                  @click="activateParent()"
                  v-if="familyPlanStatus == 'INACTIVE'"
                  type="button"
                  round
                  :disabled="loading"
                  color="rgb(78,255,84)"
                  >ACTIVE</v-btn
                >
              </td>
              <td colspan="2" class="align-middle">
                {{ statusResion ? statusResion : "" }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr style="height: 60px" v-if="reinitiateRenewal">
              <th class="align-middle" style="min-width: 235px">RENEWAL</th>
              <td></td>
              <td class="align-middle">
                <v-btn
                  @click="Reinitiate()"
                  type="button"
                  round
                  :disabled="loading"
                  color="#2ecc71"
                  style="width: 90px"
                  >REINITIATE</v-btn
                >
              </td>
              <td colspan="2" class="align-middle">
                {{ renewalFailReason ? renewalFailReason : "" }}
              </td>
            </tr>
            <tr :key="'consent' + i" v-for="(consent, i) in consentList">
              <th class="align-middle" style="min-width: 235px">
                {{ consent.consentReceiver + " CONSENT ("
                }}{{
                  (consent.consentReceiver == "PARENT"
                    ? consent.parentDetails.msisdn
                    : consent.childDetails.msisdn) + ")"
                }}
              </th>
              <td class="align-middle">{{ consent.consentStatus }}</td>
              <td class="align-middle">
                <v-btn
                  type="button"
                  @click="resendConsent(consent.id)"
                  round
                  :disabled="IsResendDisabled(consent, consentList)"
                  style="width: 90px"
                  color="#2ecc71"
                  >RESEND</v-btn
                >
              </td>
              <td class="align-middle">
                <v-btn
                  type="button"
                  @click="cancelConsent(consent.id)"
                  round
                  :disabled="loading"
                  color="#e74c3c"
                  >CANCEL</v-btn
                >
              </td>
              <td class="align-middle">
                {{ consent.opcodeDetails.description }}
                <span
                  v-if="
                    consent.transactionDetails &&
                    consent.transactionDetails.childDetails
                  "
                  >({{ consent.transactionDetails.childDetails.msisdn }})</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr
      size="50"
      style="width: 100%; margin-top: -10px; border: 0.5px solid #212529"
    />

    <v-tabs left>
      <v-tab>MAIN USER</v-tab>
      <v-tab
        :key="'childAccount' + i"
        v-for="(childAccount, i) in childAccounts"
        @click="childTabSelected(childAccount)"
        >User ({{ childAccount.childProfile.msisdn }})</v-tab
      >
      <v-tab-item :key="'tabMainProfileHistory'">
        <v-container fluid class="p-0 m-0">
          <div class="table-responsive text-break">
            <table class="table table-bordered table-striped small">
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
                  :key="'parentTransactionDetail' + i"
                  v-for="(
                    parentTransactionDetail, i
                  ) in parentTransactionDetails"
                >
                  <td>
                    {{
                      parentTransactionDetail.transactionDetails.parentDetails
                        ? parentTransactionDetail.transactionDetails
                            .parentDetails.msisdn
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.transactionDetails.childDetails
                        ? parentTransactionDetail.transactionDetails
                            .childDetails.msisdn
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      IsParentOpCode(
                        parentTransactionDetail.transactionDetails.opcodeDetails
                          .opcode
                      )
                        ? "PARENT"
                        : "CHILD"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.transactionDetails.opcodeDetails
                        .description
                    }}
                  </td>
                  <td>
                    {{ parentTransactionDetail.eventDetails.eventDescription }}
                  </td>
                  <td>{{ parentTransactionDetail.created }}</td>
                  <td>
                    {{ parentTransactionDetail.transactionDetails.channel }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.transactionDetails.userDetails
                        ? parentTransactionDetail.transactionDetails.userDetails
                            .username
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.productDetails
                        ? parentTransactionDetail.productDetails.productType
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.convertedAllocationAmount
                        ? parentTransactionDetail.convertedAllocationAmount
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.oldPricePlan
                        ? parentTransactionDetail.oldPricePlan
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.newPricePlan
                        ? parentTransactionDetail.newPricePlan
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.eventStatus
                        ? parentTransactionDetail.eventStatus
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.convertedNewChildBalance
                        ? parentTransactionDetail.convertedNewChildBalance
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.convertedNewParentBalance
                        ? parentTransactionDetail.convertedNewParentBalance
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      parentTransactionDetail.transactionDetails
                        .systemTransactionId
                        ? parentTransactionDetail.transactionDetails
                            .systemTransactionId
                        : "NA"
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-container>
      </v-tab-item>
      <v-tab-item
        :key="'childAccount' + j"
        v-for="(childAccount, j) in childAccounts"
      >
        <v-container fluid class="p-0 m-0">
          <div class="table-responsive text-break">
            <table class="table table-bordered table-striped small">
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
                  v-for="(childTransactionDetail, k) in childTransactionDetails"
                >
                  <td>
                    {{
                      childTransactionDetail.transactionDetails.parentDetails
                        ? childTransactionDetail.transactionDetails
                            .parentDetails.msisdn
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      childTransactionDetail.transactionDetails.childDetails
                        ? childTransactionDetail.transactionDetails.childDetails
                            .msisdn
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      IsParentOpCode(
                        childTransactionDetail.transactionDetails.opcodeDetails
                          .opcode
                      )
                        ? "PARENT"
                        : "CHILD"
                    }}
                  </td>
                  <td>
                    {{
                      childTransactionDetail.transactionDetails.opcodeDetails
                        .description
                    }}
                  </td>
                  <td>
                    {{ childTransactionDetail.eventDetails.eventDescription }}
                  </td>
                  <td>{{ childTransactionDetail.created }}</td>
                  <td>
                    {{ childTransactionDetail.transactionDetails.channel }}
                  </td>
                  <td>
                    {{
                      childTransactionDetail.transactionDetails.userDetails
                        ? childTransactionDetail.transactionDetails.userDetails
                            .username
                        : "NA"
                    }}
                  </td>
                  <td>
                    {{
                      childTransactionDetail.productDetails
                        ? childTransactionDetail.productDetails.productType
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
        </v-container>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
import Vue from "vue";
import utils from "../utils";

export default {
  props: {
    parentMsisdn: String,
    familyPlanStatus: String,
    statusResion: String,
    renewalFailReason: String,
    parentId: String,
    reinitiateRenewal: Boolean,
  },
  data: () => ({
    userHistoryComponentKey: 0,
    loading: false,
    submitted: false,
    consentList: [],
    childAccounts: [],
    parentTransactionDetails: [],
    childTransactionDetails: [],
    baseUrl: utils.getBaseUrl(),
  }),
  methods: {
    resendConsent(id) {
      let obj = {
        id: id,
      };
      Vue.$http
        .post(this.baseUrl + "/parent/resendConsent", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4",
            });
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4",
            });
          }
        });
    },
    cancelConsent(id) {
      let obj = {
        id: id,
      };
      Vue.$http
        .post(this.baseUrl + "/parent/cancelConsent", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4",
            });
            this.getConsentList();
            //  this.forceRerender();
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4",
            });
          }
        });
    },
    forceRerender() {
      this.userHistoryComponentKey += 1;
    },
    getConsentList() {
      let obj = {
        parentMsisdn: this.parentMsisdn,
        childMsisdn: "",
      };
      Vue.$http
        .post(this.baseUrl + "/parent/getConsentList", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.consentList = result.data;
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4",
            });
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
    getChildsOfParent() {
      let _this = this;
      let obj = { parentMsisdn: this.parentMsisdn };
      Vue.$http
        .post(this.baseUrl + "/parent/getChildsOfParent", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            _this.childAccounts = result.data.childDetails;
          }
        });
    },
    getParentTransactionDetails() {
      let obj = {
        parentId: this.parentId,
        startDate: "",
        endDate: "",
        opcodeId: "",
      };
      // /transaction/getParentTransactionDetails
      Vue.$http
        .post(this.baseUrl + "/transaction/getParentEventDetails", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.parentTransactionDetails = result.data;
          }
        });
    },
    getChildTransactionDetails(_childAccount) {
      let _this = this;
      if (!_childAccount.childTransactionDetails) {
        let obj = {
          childId: _childAccount.childProfile.id,
          startDate: "",
          endDate: "",
          opcodeId: "",
        };
        // /transaction/getChildTransactionDetails
        Vue.$http
          .post(this.baseUrl + "/transaction/getChildEventDetails", obj)
          .then((result) => {
            if (result.errorCode == "00") {
              _this.childTransactionDetails = result.data;
              _childAccount.childTransactionDetails = result.data;
            }
          });
      } else {
        _this.childTransactionDetails = _childAccount.childTransactionDetails;
      }
    },
    activateParent() {
      let obj = {
        parentMsisdn: this.parentMsisdn,
      };
      Vue.$http
        .post(this.baseUrl + "/parent/activateParent", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4",
            });
            this.familyPlanStatus = "ACTIVE";
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4",
            });
          }
        });
    },
    Reinitiate() {
      let obj = {
        parentMsisdn: this.parentMsisdn,
      };
      Vue.$http
        .post(this.baseUrl + "/parent/reinitiateRenewal", obj)
        .then((result) => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4",
            });
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4",
            });
          }
        });
    },
    childTabSelected(_childAccount) {
      this.getChildTransactionDetails(_childAccount);
    },
    IsResendDisabled(consent, consentList) {
      if (consent.consentReceiver == "PARENT") {
        let dates = consentList
          .filter((m) => m.consentReceiver == "PARENT")
          .map((ele) => new Date(ele.created));
        let minDate = new Date(Math.min.apply(null, dates));
        let date = new Date(consent.created);
        if (date.getTime() == minDate.getTime()) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.getConsentList();
    this.getChildsOfParent();
    this.getParentTransactionDetails();
  },
};
</script>
<style scoped>
.table th,
.table td {
  padding: 0.2rem !important;
}
</style>