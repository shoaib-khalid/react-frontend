<template>
  <div class="center col-sm-12 col-md-12 col-lg-12">
    <div class="row">
      <div class="col-sm-12 col-md-3 col-lg-3 pr-1">
        <div class="card sticky-top" style="background: rgba(0, 188, 212,0.1); z-index:1;top:0">
          <div class="card-block">
            <div class="row p-2">
              <div class="col-md-12 pb-1 pt-1">
                <h6 class="single-line user-heading">Main Profile</h6>
                <span
                  title="Change Price Plan"
                  v-if="!parentProfileEditing"
                  class="cursor-pointer"
                  @click="editParentProfile()"
                >
                  <i class="material-icons">edit</i>
                </span>
                <span
                  title="Cancel"
                  v-if="parentProfileEditing"
                  class="cursor-pointer"
                  @click="resetParentProfile()"
                >
                  <i class="material-icons">clear</i>
                </span>
                <span title="Refresh" class="float-right" style="cursor:pointer" @click="refresh()">
                  <b>
                    <feather size="25" stroke="black" type="refresh-cw"></feather>
                  </b>
                </span>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <h6>MSISDN: {{parentProfile.msisdn}}</h6>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <h6 v-if="!parentProfileEditing">
                  PRICE PLAN:
                  {{parentProfile.pricePlanDetails.cbsPlanNameParent}}
                </h6>
                <span :hidden="!parentProfileEditing">
                  <h6 class="single-line">PRICE PLAN:</h6>
                  <v-select
                    style="margin-top:-15px; margin-bottom:-15px; padding:0px"
                    class="uprcase"
                    :items="pricePlans"
                    v-model="selectedPricePlan"
                    item-text="cbsPlanNameParent"
                    item-value="id"
                    v-on:change="changePricePlan()"
                  >
                    <template slot="item" slot-scope="data">
                      <div class="text-uppercase">{{ data.item.cbsPlanNameParent }}</div>
                    </template>
                  </v-select>
                </span>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <h6>NUMBER STATUS: {{parentProfile.status}}</h6>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <h6>BILLING DATE: {{parentProfile.billingDate}}</h6>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <table class="table table-bordered child-report small">
                  <thead>
                    <tr>
                      <th colspan="2">
                        <h6>Shareable Resources</h6>
                      </th>
                    </tr>
                    <tr>
                      <th class="text-center">ALLOCATED RESOURCES</th>
                      <th class="text-center">REMAINING RESOURCES</th>
                    </tr>
                    <tr>
                      <th colspan="2">{{parentProfile.pricePlanDetails.cbsPlanNameParent}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==1">{{getMonthlyQuota(product)}}</li>
                        </ul>
                      </td>
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==1">{{ getRemainingQuota(product)}}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr v-if="IsShareableAddOnResourceExists">
                      <th colspan="2">Add-on Bundle</th>
                    </tr>
                    <tr v-if="IsShareableAddOnResourceExists">
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==2">{{ getMonthlyQuota(product)}}</li>
                        </ul>
                      </td>
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==2">{{ getRemainingQuota(product)}}</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  v-if="IsNonShareableResourceExists"
                  class="table table-bordered child-report small"
                >
                  <thead>
                    <tr>
                      <th colspan="2">
                        <h6>Non Sharable Resources</h6>
                      </th>
                    </tr>
                    <tr>
                      <th class="text-center">ALLOCATED RESOURCES</th>
                      <th class="text-center">REMAINING RESOURCES</th>
                    </tr>
                    <tr>
                      <th colspan="2">{{parentProfile.pricePlanDetails.cbsPlanNameParent}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==0">{{ getMonthlyQuota(product)}}</li>
                        </ul>
                      </td>
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==0">{{ getRemainingQuota(product) }}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr v-if="IsNonShareableAddOnResourceExists">
                      <th colspan="2">Add-on Bundle</th>
                    </tr>
                    <tr v-if="IsNonShareableAddOnResourceExists">
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==3">{{ getMonthlyQuota(product)}}</li>
                        </ul>
                      </td>
                      <td>
                        <ul :key="'product' + i" v-for="(product, i) in parentMonthlyBalance">
                          <li v-if="product.isFPService==3">{{ getRemainingQuota(product)}}</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <v-flex xs12 px-4 py-4 class="text-center">
                <v-btn
                  v-if="parentProfile.status=='ACTIVE'"
                  type="button"
                  round
                  :disabled="loading"
                  @click="Unsubscribe()"
                  color="rgb(254,173,33)"
                >Unsubscribe</v-btn>
                <v-btn
                  v-if="parentProfile.status=='TERMINATED'"
                  type="button"
                  round
                  :disabled="loading"
                  @click="Resume()"
                  color="rgb(254,173,33)"
                >Resume</v-btn>
              </v-flex>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-9 col-lg-9 pl-1">
        <div class="card card-block">
          <v-tabs left>
            <v-tab>User Profile</v-tab>
            <v-tab>TRANSACTION DETAILS</v-tab>
            <v-tab-item :key="'tabuserProfile'">
              <v-container fluid>
                <div
                  class="row pl-3 pr-3"
                  :key="'monthlyResourcesComponentKey_'+monthlyResourcesComponentKey"
                >
                  <h5>MONTHLY RESOURCES SHARED</h5>
                  <span class="small pl-2 pt-1">
                    ( Last updated on :
                    <span
                      class="font-weight-bold"
                    >{{parentProfile.lastChildUpdateDateTime| formatDate}}</span>, Renewed on Bill Cycle:
                    <span
                      class="font-weight-bold"
                    >{{renewedDate| formatDate}}</span> )
                  </span>
                  <div class="table-responsive" v-if="objSelectedPricePlan.id">
                    <table class="table table-sm table-striped table-bordered-outside">
                      <tbody>
                        <tr class="table-success">
                          <th>USER</th>
                          <th></th>
                          <template v-for="(product, i) in objSelectedPricePlan.productList">
                            <template v-if="product.isShareable==1">
                              <th :key="'product_name_th' + i">{{product.productInfo.productName}}</th>
                              <th :key="'product_pct_th' + i">PERCENTAGE</th>
                            </template>
                          </template>
                        </tr>
                        <tr>
                          <td>PRICE PLAN</td>
                          <td>{{objSelectedPricePlan.numberOfLines + "L"}}</td>
                          <template v-for="(product, i) in objSelectedPricePlan.productList">
                            <template v-if="product.isShareable==1">
                              <td :key="'product_amt_th' + i">{{getProductValue(product)}}</td>
                              <td :key="'product_pct_value' + i">NA</td>
                            </template>
                          </template>
                        </tr>
                        <tr>
                          <td>MAIN USER</td>
                          <td>{{parentProfile.msisdn }}</td>
                          <template v-for="(product, i) in objSelectedPricePlan.productList">
                            <template v-if="product.isShareable==1">
                              <td :key="'product_amt_th' + i">{{getParentProductValue(product)}}</td>
                              <td
                                :key="'product_pct_value' + i"
                              >{{getParentProductPct(product) + "%"}}</td>
                            </template>
                          </template>
                        </tr>
                        <tr :key="'child_row' + h" v-for="(child, h) in childAccounts">
                          <template v-if="child">
                            <td>{{"User 0"+ (h+1)}}</td>
                            <td>{{child.childProfile.msisdn}}</td>
                            <template v-for="(product, i) in objSelectedPricePlan.productList">
                              <template v-if="product.isShareable==1">
                                <td
                                  :key="'child_product_amt_th' + i+h"
                                >{{getChildProductValue(product,child)}}</td>
                                <td
                                  :key="'child_product_pct_value' + i+h"
                                >{{getChildProductPct(product,child) + "%"}}</td>
                              </template>
                            </template>
                          </template>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <ChildsProfileComponent
                  :key="childsProfileComponentKey"
                  v-bind:parentMsisdn="parentMsisdn"
                  v-bind:parentId="parentProfile.id"
                  v-bind:numberOfLines="parentProfile.pricePlanDetails.numberOfLines"
                  v-bind:parentMonthlyBalance="parentMonthlyBalance"
                  v-bind:selectedPricePlan="objSelectedPricePlan"
                  v-on:childAdded="onChildAdded"
                  v-on:childDeleted="onChildDeleted"
                  v-if="parentProfile.id"
                ></ChildsProfileComponent>
              </v-container>
            </v-tab-item>
            <v-tab-item :key="'tabUserHistory'">
              <v-container fluid>
                <UserHistoryComponent
                  :key="userHistorComponentKey"
                  v-bind:parentMsisdn="parentMsisdn"
                  v-bind:familyPlanStatus="parentProfile.status"
                  v-bind:statusResion="parentProfile.reason"
                  v-bind:renewalFailReason="parentProfile.renewalFailReason"
                  v-bind:parentId="parentProfile.id"
                  v-bind:reinitiateRenewal="reinitiateRenewal"
                  v-if="parentProfile.id"
                ></UserHistoryComponent>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import Vue from "vue";
import ChildsProfileComponent from "./ChildsProfileComponent";
import UserHistoryComponent from "./UserHistoryComponent";

import utils from "../utils";

export default {
  components: {
    ChildsProfileComponent
  },

  data: () => ({
    childsProfileComponentKey: 0,
    userHistorComponentKey: 0,
    monthlyResourcesComponentKey: 0,
    parentProfileEditing: false,
    renewedDate: "",
    IsNonShareableResourceExists: false,
    IsNonShareableAddOnResourceExists: false,
    IsShareableAddOnResourceExists: false,
    selectedPricePlan: "",
    objSelectedPricePlan: "",
    parentMsisdn: "",
    totalChildCount: undefined,
    SMSId: "",
    OnNetCallId: "",
    OffNetCallId: "",
    DataId: "",
    reinitiateRenewal: false,
    parentProfile: {
      id: "",
      msisdn: "",
      status: "",
      pricePlanDetails: {
        id: "",
        name: "",
        numberOfLines: "",
        cbsPlanNameParent: "",
        productDetails: [
          {
            id: "",
            amount: 0,
            productId: "",
            productList: {
              id: "",
              productName: "",
              productType: ""
            }
          }
        ]
      }
    },
    parentMonthlyBalance: {},
    pricePlans: [],
    otherPricePlan: [],
    // parentResources: {},
    loading: false,
    submitted: false,
    childAccounts: []
  }),
  methods: {
    forceRerender() {
      this.childsProfileComponentKey += 1;
      this.userHistorComponentKey += 1;
      this.monthlyResourcesComponentKey += 1;
    },
    getMonthlyQuota(product) {
      let value = "";
      if (product.productDetails.quotaUnit == "BYTE") {
        value =
          this.formatBytes(product.monthlyQuota) +
          " " +
          product.productDetails.productName.replace("Internet", "MBs");
      } else if (product.productDetails.quotaUnit == "SECOND") {
        value =
          utils.convertSecondsToMins(product.monthlyQuota) +
          " " +
          product.productDetails.productName;
      } else {
        value = product.monthlyQuota + " " + product.productDetails.productName;
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
    Unsubscribe() {
      Swal.fire({
        title: "ARE YOU SURE YOU WANT TO UNSUBSCRIBE FROM FAMILY PLANS?",
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
        inputValidator: value => {
          return new Promise(resolve => {
            if (value) {
              resolve();
              this.unsubscribeParent(value);
            } else {
              resolve("You need to select other plan");
            }
          });
        }
      });
    },
    Resume() {
      Swal.fire({
        title: "ARE YOU SURE YOU WANT TO RESUME ?",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#fd2222",
        customClass: "swal-wide",
        confirmButtonText: "RESUME",
        reverseButtons: true,
        cancelButtonText: "CANCEL"
      }).then(result => {
        if (result.value) {
          this.resumeParent();
        }
      });
    },

    editParentProfile() {
      this.parentProfileEditing = true;
    },
    resetParentProfile() {
      this.parentProfileEditing = false;
    },

    changePricePlan() {
      Swal.fire({
        // title: "",
        text: "KINDLY CONFIRM YOUR CHANGE IN THE FAMILY PLAN.",
        // icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#fd2222",
        customClass: "swal-wide",
        confirmButtonText: "CONFIRM",
        reverseButtons: true,
        cancelButtonText: "CANCEL"
      }).then(result => {
        this.parentProfileEditing = false;
        if (result.value) {
          let allowedNumberOfLines = this.pricePlans.find(
            m => m.id == this.selectedPricePlan
          ).numberOfLines;
          if (allowedNumberOfLines - 1 < this.totalChildCount) {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title:
                "To downgrade price plan, extra child needs to be deleted.",
              time: "4"
            });
            this.selectedPricePlan = this.parentProfile.pricePlanDetails.id;
            this.objSelectedPricePlan = this.pricePlans.find(
              m => m.id == this.selectedPricePlan
            );
          } else {
            this.changeParentPP(this.selectedPricePlan);
            this.parentProfile.pricePlanDetails.id = this.selectedPricePlan;
          }
        } else {
          this.selectedPricePlan = this.parentProfile.pricePlanDetails.id;
          this.objSelectedPricePlan = this.pricePlans.find(
            m => m.id == this.selectedPricePlan
          );
        }
      });
    },
    changeParentPP(newPPId) {
      let obj = {
        parentMsisdn: this.parentProfile.msisdn,
        newFPPricePlanId: newPPId
      };
      Vue.$http.post("/parent/changeParentPP", obj).then(result => {
        if (result.errorCode == "00") {
          this.$store.commit("notis/setAlert", {
            type: "success",
            title: result.errorMsg,
            time: "4"
          });
          this.getParentProfile();
        } else {
          this.$store.commit("notis/setAlert", {
            type: "error",
            title: result.errorMsg,
            time: "4"
          });
        }
      });
    },
    getFPPricePlan: function() {
      let _this = this;
      return new Promise(resolve => {
        Vue.$http.post("/general/getFPPricePlan", {}).then(result => {
          if (result.errorCode == "00") {
            _this.pricePlans = result.data;
            resolve();
          }
        });
      });
    },
    getOtherPricePlan() {
      return new Promise(resolve => {
        let param = {
          parentMsisdn: this.parentMsisdn,
          typeOfPricePlan: "PREPAID"
        };
        Vue.$http.post("/general/getOtherPricePlan", param).then(result => {
          if (result.errorCode == "00") {
            var obj = {};
            result.data.forEach(element => {
              obj[element.id] = element.name;
            });
            resolve(obj);
          }
        });
      });
    },
    getParentProfile: function() {
      let _this = this;
      let products = [];
      let obj = { parentMsisdn: _this.parentMsisdn };
      Vue.$http.post("/parent/getParentProfile", obj).then(result => {
        if (result.errorCode == "00") {
          _this.parentProfile = result.data.parentProfile;
          _this.renewedDate = result.data.renewedDate;
          _this.reinitiateRenewal = result.data.reinitiateRenewal;
          products = result.data.parentProfile.pricePlanDetails.productList.filter(
            m => m.isShareable == 1
          );

          _this.SMSId = products.find(
            m => m.productInfo.productType == "SMS"
          ).productId;
          _this.OnNetCallId = products.find(
            m => m.productInfo.productType == "VOICE-ONNET"
          ).productId;
          _this.OffNetCallId = products.find(
            m => m.productInfo.productType == "VOICE-OFFNET"
          ).productId;
          _this.DataId = products.find(
            m => m.productInfo.productType == "DATA"
          ).productId;

          sessionStorage.setItem("SMSId", _this.SMSId);
          sessionStorage.setItem("OnNetCallId", _this.OnNetCallId);
          sessionStorage.setItem("OffNetCallId", _this.OffNetCallId);
          sessionStorage.setItem("DataId", _this.DataId);

          this.parentMonthlyBalance = result.data.parentMonthlyBalance;
          this.selectedPricePlan = this.parentProfile.pricePlanDetails.id;
          this.objSelectedPricePlan = this.pricePlans.find(
            m => m.id == this.selectedPricePlan
          );

          _this.totalChildCount = result.data.totalChildCount;

          // _this.parentResources = _this.getParentResources(
          //   _this.parentMonthlyBalance
          // );
          _this.IsNonShareableResourceExists = _this.parentMonthlyBalance.find(
            m => m.isFPService == 0
          );
          _this.IsNonShareableAddOnResourceExists = _this.parentMonthlyBalance.find(
            m => m.isFPService == 3
          );
          _this.IsShareableAddOnResourceExists = _this.parentMonthlyBalance.find(
            m => m.isFPService == 2
          );
        }
      });
    },
    unsubscribeParent(newPricePlan) {
      let obj = {
        parentMsisdn: this.parentMsisdn,
        newPricePlanId: newPricePlan
      };
      return new Promise(() => {
        Vue.$http.post("/parent/unsubscribeParent", obj).then(result => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4"
            });
            this.getParentProfile();
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4"
            });
          }
        });
      });
    },
    resumeParent() {
      let obj = {
        parentMsisdn: this.parentMsisdn
      };
      return new Promise(() => {
        Vue.$http.post("/parent/resumeParent", obj).then(result => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4"
            });
            this.getParentProfile();
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4"
            });
          }
        });
      });
    },
    onChildAdded() {
      this.totalChildCount = this.totalChildCount + 1;
    },
    onChildDeleted() {
      this.totalChildCount = this.totalChildCount - 1;
    },
    formatBytes(bytes) {
      return utils.formatBytes(bytes);
    },
    getOnNetVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        m => m.parentProductId.productId == this.OnNetCallId
      );
      if (obj) {
        return obj.monthlyQuota;
      }
      return 0;
    },
    getOffNetVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        m => m.parentProductId.productId == this.OffNetCallId
      );
      if (obj) {
        return obj.monthlyQuota;
      }
      return 0;
    },
    getSMSVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        m => m.parentProductId.productId == this.SMSId
      );
      if (obj) {
        return obj.monthlyQuota;
      }
      return 0;
    },
    getDataVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        m => m.parentProductId.productId == this.DataId
      );
      if (obj) {
        return obj.monthlyQuota;
      }
      return 0;
    },
    getParentResources(_parentMonthlyBalance) {
      return {
        onNetVal: this.getOnNetVal(_parentMonthlyBalance),
        offNetVal: this.getOffNetVal(_parentMonthlyBalance),
        smsVal: this.getSMSVal(_parentMonthlyBalance),
        gbVal: this.getDataVal(_parentMonthlyBalance)
      };
    },
    refresh() {
      this.getParentProfile();
      this.getChildsOfParent(this.parentMsisdn);
      this.forceRerender();
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
    getParentProductValue(product) {
      let totalChildQuota = this.getSumOfChildsQuota(product.productId);
      let parentQuota = product.amount - totalChildQuota;
      if (product.productInfo.quotaUnit == "BYTE") {
        return this.formatBytes(parentQuota);
      } else if (product.productInfo.quotaUnit == "SECOND") {
        return utils.convertSecondsToMins(parentQuota);
      } else {
        return parentQuota;
      }
    },
    getParentProductPct(product) {
      // let _parentMonthlyBalance = this.parentMonthlyBalance.find(
      //   m => m.parentProductId.productId == product.productId
      // );
      if (product.amount && product.amount > 0) {
        let totalChildQuota = this.getSumOfChildsQuota(product.productId);
        return (
          ((product.amount - totalChildQuota) / product.amount) *
          100
        ).toFixed(2);
      } else {
        return 0;
      }
    },
    getSumOfChildsQuota(productId) {
      let totalChildQuota = 0;
      if (this.childAccounts) {
        this.childAccounts.forEach(child => {
          let _childMonthlyConfig = child.childMonthlyConfig.find(
            m => m.childProductId.productId == productId
          );
          if (_childMonthlyConfig && _childMonthlyConfig.monthlyQuota) {
            totalChildQuota =
              totalChildQuota + _childMonthlyConfig.monthlyQuota;
          }
        });
      }
      return totalChildQuota;
    },
    getChildProductValue(product, child) {
      if (child && product) {
        let _childProduct = child.childMonthlyConfig.find(
          m => m.childProductId.productId == product.productId
        );
        if (
          _childProduct &&
          _childProduct.productDetails &&
          _childProduct.monthlyQuota
        ) {
          if (_childProduct.productDetails.quotaUnit == "BYTE") {
            return this.formatBytes(_childProduct.monthlyQuota);
          } else if (_childProduct.productDetails.quotaUnit == "SECOND") {
            return utils.convertSecondsToMins(_childProduct.monthlyQuota);
          } else {
            return _childProduct.monthlyQuota;
          }
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
    getChildProductPct(product, child) {
      if (child && product) {
        let _childMonthlyBalance = child.childMonthlyConfig.find(
          m => m.childProductId.productId == product.productId
        );
        if (
          _childMonthlyBalance &&
          _childMonthlyBalance.monthlyQuota &&
          product.amount
        ) {
          return (
            (_childMonthlyBalance.monthlyQuota / product.amount) *
            100
          ).toFixed(2);
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
    getChildsOfParent(parentMsisdn) {
      let obj = { parentMsisdn };
      Vue.$http.post("/parent/getChildsOfParent", obj).then(result => {
        if (result.errorCode == "00") {
          this.childAccounts = result.data.childDetails;
          this.monthlyResourcesComponentKey += 1;
        }
      });
    }
  },
  mounted() {
    this.parentMsisdn = sessionStorage.getItem("ParentMSISDN")
      ? sessionStorage.getItem("ParentMSISDN")
      : undefined;

    if (!this.parentMsisdn) {
      this.$store
        .commit("notis/setAlert", {
          type: "error",
          title: "Parent MSISDN Not Found.",
          time: "4"
        })
        .then(() => {
          this.$router.push({ name: "fpSearch" });
        });
    }
    this.getFPPricePlan().then(() => {
      this.getParentProfile();
      this.getChildsOfParent(this.parentMsisdn);
    });
    // this.getProducts().then(() => {});
  }
};
</script>
<style scoped>
.table th,
.table td {
  padding: 0.2rem !important;
}
.swal-wide {
  width: 550px !important;
}
.swal2-confirm {
  width: 150px;
}
.swal2-cancel {
  width: 150px;
}

input:valid {
  color: green;
}
input:invalid {
  color: red;
}
.font-lg {
  font-size: 50px;
}
.uprcase {
  text-transform: uppercase;
}
.center {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
}

.sticky-top {
  top: 100px;
}
.single-line {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 15px;
}
.user-heading {
  margin-top: 5px;
}
.cursor-pointer {
  cursor: pointer;
}
.card {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
}
</style>
