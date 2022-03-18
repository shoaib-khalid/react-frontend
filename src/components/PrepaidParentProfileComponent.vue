<template>
  <div class="center col-sm-12 col-md-12 col-lg-12">
    <div class="row">
      <div class="col-sm-12 col-md-3 col-lg-3 pr-1">
        <div
          class="card sticky-top"
          style="background: rgba(0, 188, 212, 0.1); z-index: 1; top: 0"
        >
          <div class="card-block">
            <div class="row p-2">
              <div class="col-md-12 pb-1 pt-1">
                <h6 class="single-line user-heading">Main Profile</h6>
                <!-- <span
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
                </span> -->
                <span
                  title="Refresh"
                  class="float-right"
                  style="cursor: pointer"
                  @click="refresh()"
                >
                  <b>
                    <feather
                      size="25"
                      stroke="black"
                      type="refresh-cw"
                    ></feather>
                  </b>
                </span>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <h6>MSISDN: {{ parentProfile.msisdn }}</h6>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <h6>PRICE PLAN: {{ parentProfile.pricePlan }}</h6>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <h6>NUMBER STATUS: {{ parentProfile.assetStatus }}</h6>
              </div>
              <div class="col-md-12 pb-1 pt-1">
                <!-- TODO -->
                <h6>User Type: {{ parentProfile.customerType }}</h6>
              </div>

              <div class="col-md-12 pb-1 pt-1">
                <table class="table table-bordered child-report small">
                  <thead>
                    <tr>
                      <th colspan="2">
                        <h6>Purchased Offers</h6>
                      </th>
                    </tr>
                    <tr>
                      <th class="text-center">PURCHASED RESOURCES</th>
                      <th class="text-center">REMAINING RESOURCES</th>
                    </tr>
                    <!-- <tr>
                      <th colspan="2">{{parentProfile.pricePlanDetails.cbsPlanNameParent}}</th>
                    </tr> -->
                  </thead>
                  <!-- <tbody>
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
                  </tbody> -->
                </table>
              </div>
            </div>
            <div>
              <v-flex xs12 px-4 py-4 class="text-center">
                <v-btn
                  v-if="parentProfile.status == 'ACTIVE'"
                  type="button"
                  round
                  :disabled="loading"
                  @click="Unsubscribe()"
                  color="rgb(254,173,33)"
                  >Unsubscribe</v-btn
                >
                <v-btn
                  v-if="parentProfile.status == 'TERMINATED'"
                  type="button"
                  round
                  :disabled="loading"
                  @click="Resume()"
                  color="rgb(254,173,33)"
                  >Resume</v-btn
                >
                <v-btn
                  v-if="
                    parentProfile.status == 'PENDING_CBS' ||
                    parentProfile.status == 'CBS_NOT_UPDATE'
                  "
                  type="button"
                  round
                  :disabled="loading"
                  @click="terminate()"
                  color="rgb(254,173,33)"
                  >Terminate</v-btn
                >
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
                <v-expansion-panel>
                  <v-expansion-panel-content
                    v-for="(group, i) of parentProfile.groups"
                    :key="i"
                  >
                    <template v-slot:header>
                      <div>{{ group.name }}</div>
                    </template>
                    <v-card>
                      <v-card-text class="grey lighten-3">
                        <div class="row pt-2 col-md-12">
                          <h5>{{ group.name }}</h5>
                          <span
                            title="Edit Group Name"
                            class="cursor-pointer pl-2"
                            @click="showEditGroupDialog(group.name)"
                          >
                            <i class="material-icons">edit</i>
                          </span>
                          <span
                            title="Delete Group"
                            class="cursor-pointer pl-2"
                            @click="showDeleteGroupDialog(group.name)"
                          >
                            <i class="material-icons">delete_forever</i>
                          </span>
                        </div>
                        <!-- <div class="row">
                          <v-btn
                            round
                            :disabled="loading"
                            color="#3498db"
                            dark
                            @click="showSubscribeDialog(group.name)"
                          >
                            <v-icon dark left>sim_card</v-icon>
                            Subscribe
                          </v-btn>
                        </div> -->
                        <v-divider></v-divider>
                        <template
                          v-for="(member, memberIndex) of group.members"
                        >
                          <PrepaidChildProfileComponent
                            :key="memberIndex"
                            :childIndex="memberIndex"
                            :parentMsisdn="parentMsisdn"
                            :child="member"
                            @updateMsisdn="
                              showUpdateChildMsisdnDialog(i, member.msisdn)
                            "
                            @delete="showDeleteChildDialog(i, member.msisdn)"
                          ></PrepaidChildProfileComponent>
                        </template>
                        <div class="row">
                          <v-btn
                            round
                            :disabled="loading"
                            color="#3498db"
                            dark
                            @click="showAddUserDialog(group.name)"
                          >
                            <v-icon dark left>add</v-icon>
                            Add User
                          </v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <div class="row pl-4">
                  <v-dialog v-model="addGroupDialog" width="500">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        round
                        :disabled="loading"
                        color="#3498db"
                        dark
                        v-on="on"
                      >
                        <v-icon dark left>add</v-icon>
                        Add Group
                      </v-btn>
                    </template>
                    <v-card>
                      <v-form
                        ref="newGroupForm"
                        v-model="valid"
                        lazy-validation
                      >
                        <v-card-title
                          primary-title
                          class="headline grey lighten-2"
                        >
                          Add Group
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12>
                                <v-text-field
                                  label="Group Name*"
                                  :rules="[rules.required]"
                                  v-model="newGroupName"
                                >
                                </v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat @click="closeAddGroupDialog">Close</v-btn>
                          <v-btn
                            type="submit"
                            round
                            dark
                            color="#3498db"
                            @click="createGroup"
                            >Save</v-btn
                          >
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-dialog>
                </div>
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
    <v-dialog v-model="editGroupDialog" max-width="500px">
      <v-card>
        <v-form ref="editGroupForm" v-model="valid" lazy-validation>
          <v-card-title primary-title class="headline grey lighten-2">
            Update Group
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Group Name*"
                    :rules="[rules.required]"
                    v-model="newGroupName"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="closeEditGroupDialog">Cancel</v-btn>
            <v-btn type="submit" round dark color="#3498db" @click="updateGroup"
              >Update</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addUserDialog" max-width="500px">
      <v-card>
        <v-form ref="addUserForm" v-model="valid" lazy-validation>
          <v-card-title primary-title class="headline grey lighten-2">
            Add User
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="newUserMsisdn"
                    :rules="[rules.required]"
                    pattern="^\d{11}$"
                    v-mask="'03#########'"
                    type="text"
                    :error-messages="errors.collect('MSISDN')"
                    data-vv-name="MSISDN"
                    label="Enter MSISDN"
                    @keypress="isNumber($event)"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="closeAddUserDialog">Cancel</v-btn>
            <v-btn type="submit" round dark color="#3498db" @click="addUser"
              >Add</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="updateChildMsisdnDialog" max-width="500px">
      <v-card>
        <v-form ref="updateChildMsisdnForm" v-model="valid" lazy-validation>
          <v-card-title primary-title class="headline grey lighten-2">
            Update User
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="updatedChildMsisdn"
                    :rules="[rules.required]"
                    pattern="^\d{11}$"
                    v-mask="'03#########'"
                    type="text"
                    :error-messages="errors.collect('MSISDN')"
                    data-vv-name="MSISDN"
                    label="Enter MSISDN"
                    @keypress="isNumber($event)"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="closeUpdateChildMsisdnDialog">Cancel</v-btn>
            <v-btn
              type="submit"
              round
              dark
              color="#3498db"
              @click="updateChildMsisdn"
              >Update</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="subscribeDialog" scrollable max-width="500px">
      <v-card>
        <v-card-title primary-title><h3>Subscribe to Bundle</h3></v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-card v-for="(bundle, bundleIndex) of bundles" :key="bundleIndex">
            <!-- <v-card-title primary-title> -->
            <div class="card-content">
              <div class="headline">{{ bundle.name }}</div>
              <div class="headline">Rs. {{ bundle.price }}</div>
              <div class="grey--text">{{ bundle.validity }} days</div>
              <div class="flex">
                <div
                  v-for="(resource, resourceIndex) of bundle.resources"
                  :key="resourceIndex"
                >
                  <p class="grey--text">{{ resource.name }}</p>
                  <h5>{{ resource.amount }}</h5>
                </div>
              </div>
            </div>
            <!-- </v-card-title> -->
            <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                round
                :disabled="loading"
                dark
                color="#3498db"
                @click="showSubscribeDialog(group.name)"
              >
                <v-icon dark left>sim_card</v-icon>
                Subscribe
              </v-btn>
            </v-card-actions> -->
            <v-divider></v-divider>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="closeSubscribeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :top="true"
      :color="snackbarColor"
      :timeout="timeout"
    >
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar = false"> Close </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import Vue from "vue";
import PrepaidChildProfileComponent from "./PrepaidChildProfileComponent.vue";
import ApiUrls from "../enums/ApiUrls";
import UserHistoryComponent from "./UserHistoryComponent";

import utils from "../utils";

export default {
  components: {
    PrepaidChildProfileComponent,
  },

  data: () => ({
    parentMsisdn: "",
    parentProfile: {
      msisdn: "",
      subscriber: true,
      groups: [],
      pricePlan: "",
      customerType: "",
      assetStatus: "",
      createdDate: "",
      lastModifiedDate: "",
      errorMsgUssd: "",
    },
    parentMonthlyBalance: {},
    pricePlans: [],
    otherPricePlan: [],
    // parentResources: {},
    loading: false,
    submitted: false,
    childAccounts: [],
    basePrepaidUrl: "",

    // Dialogs
    valid: true,
    addUserDialog: false,
    addGroupDialog: false,
    editGroupDialog: false,
    updateChildMsisdnDialog: false,
    subscribeDialog: false,
    newGroupName: "",
    groupEditRequest: {
      existingGroupName: "",
      newGroupName: "",
      parentMsisdn: "",
    },
    newUserMsisdn: "",
    newUserRequest: {
      groupName: "",
      memberMsisdn: "",
      parentMsisdn: "",
    },
    updatedChildMsisdn: "",
    updateChildMsisdnRequest: {
      groupNumber: 0,
      newMemberMsisdn: "",
      oldMemberMsisdn: "",
      parentMsisdn: "",
    },
    rules: {
      required: (value) => !!value || "Required.",
    },

    //Snackbar
    snackbar: false,
    snackbarText: "",
    snackbarColor: "info",
    timeout: 10000,

    bundles: [],
  }),
  methods: {
    forceRerender() {
      this.childsProfileComponentKey += 1;
      this.userHistorComponentKey += 1;
      this.monthlyResourcesComponentKey += 1;
    },
    getMonthlyQuota(product) {
      let value = "";
      return value;
    },
    getRemainingQuota(product) {
      let value = "";
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
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value) {
              resolve();
              this.unsubscribeParent(value);
            } else {
              resolve("You need to select other plan");
            }
          });
        },
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
        cancelButtonText: "CANCEL",
      }).then((result) => {
        if (result.value) {
          this.resumeParent();
        }
      });
    },

    terminate() {
      Swal.fire({
        title: "ARE YOU SURE YOU WANT TO TERMINATE ?",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#fd2222",
        customClass: "swal-wide",
        confirmButtonText: "RESUME",
        reverseButtons: true,
        cancelButtonText: "CANCEL",
      }).then((result) => {
        if (result.value) {
          this.terminateParent();
        }
      });
    },

    changePricePlan() {},
    changeParentPP(newPPId) {
      let obj = {
        parentMsisdn: this.parentProfile.msisdn,
        newFPPricePlanId: newPPId,
      };
      Vue.$http.post("/parent/changeParentPP", obj).then((result) => {
        if (result.errorMsgUssdCode == "00") {
          this.$store.commit("notis/setAlert", {
            type: "success",
            title: result.errorMsgUssdMsg,
            time: "4",
          });
          this.getParentProfile();
        } else {
          this.$store.commit("notis/setAlert", {
            type: "error",
            title: result.errorMsgUssdMsg,
            time: "4",
          });
        }
      });
    },
    getFPPricePlan: function () {
      let _this = this;
      return new Promise((resolve) => {
        Vue.$http.post("/general/getFPPricePlan", {}).then((result) => {
          if (result.errorMsgUssdCode == "00") {
            _this.pricePlans = result.data;
            resolve();
          }
        });
      });
    },
    getOtherPricePlan() {
      return new Promise((resolve) => {
        let param = {
          parentMsisdn: this.parentMsisdn,
          typeOfPricePlan: "PREPAID",
        };
        Vue.$http.post("/general/getOtherPricePlan", param).then((result) => {
          if (result.errorMsgUssdCode == "00") {
            var obj = {};
            result.data.forEach((element) => {
              obj[element.id] = element.name;
            });
            resolve(obj);
          }
        });
      });
    },
    getParentProfile: function () {
      let _this = this;
      const obj = { parentMsisdn: _this.parentMsisdn };
      Vue.$http.post(`${this.basePrepaidUrl}/groups/get`, obj).then(
        (result) => {
          if (!result.errorMsgUssd) {
            _this.parentProfile = result;
            console.log(_this.parentProfile);
          } else {
            this.showSnackbar(result.errorMsgUssd, true);
          }
        },
        (error) => {
          this.showSnackbar(error, true);
        }
      );
    },
    getBundles: function () {
      let _this = this;
      Vue.$http.post(`${this.basePrepaidUrl}/bundles/get`).then(
        (result) => {
          if (result.data) {
            _this.bundles = result.data;
          }
        },
        (error) => {
          this.showSnackbar(error, true);
        }
      );
    },
    unsubscribeParent(newPricePlan) {
      let obj = {
        parentMsisdn: this.parentMsisdn,
        newPricePlanId: newPricePlan,
      };
      return new Promise(() => {
        Vue.$http.post("/parent/unsubscribeParent", obj).then((result) => {
          if (result.errorMsgUssdCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsgUssdMsg,
              time: "4",
            });
            this.getParentProfile();
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsgUssdMsg,
              time: "4",
            });
          }
        });
      });
    },
    resumeParent() {
      let obj = {
        parentMsisdn: this.parentMsisdn,
      };
      return new Promise(() => {
        Vue.$http.post("/parent/resumeParent", obj).then((result) => {
          if (result.errorMsgUssdCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsgUssdMsg,
              time: "4",
            });
            this.getParentProfile();
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsgUssdMsg,
              time: "4",
            });
          }
        });
      });
    },

    terminateParent() {
      let obj = {
        parentMsisdn: this.parentMsisdn,
      };
      return new Promise(() => {
        Vue.$http.post("/parent/terminateParent", obj).then((result) => {
          if (result.errorMsgUssdCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsgUssdMsg,
              time: "4",
            });
            this.getParentProfile();
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsgUssdMsg,
              time: "4",
            });
          }
        });
      });
    },

    formatBytes(bytes) {
      return utils.formatBytes(bytes);
    },
    getOnNetVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        (m) => m.parentProductId.productId == this.OnNetCallId
      );
      if (obj) {
        return obj.monthlyQuota;
      }
      return 0;
    },
    getOffNetVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        (m) => m.parentProductId.productId == this.OffNetCallId
      );
      if (obj) {
        return obj.monthlyQuota;
      }
      return 0;
    },
    getSMSVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        (m) => m.parentProductId.productId == this.SMSId
      );
      if (obj) {
        return obj.monthlyQuota;
      }
      return 0;
    },
    getDataVal(_parentMonthlyBalance) {
      let obj = _parentMonthlyBalance.find(
        (m) => m.parentProductId.productId == this.DataId
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
        gbVal: this.getDataVal(_parentMonthlyBalance),
      };
    },
    refresh() {
      this.getParentProfile();
      //   this.forceRerender();
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
        this.childAccounts.forEach((child) => {
          let _childMonthlyConfig = child.childMonthlyConfig.find(
            (m) => m.childProductId.productId == productId
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
          (m) => m.childProductId.productId == product.productId
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
          (m) => m.childProductId.productId == product.productId
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
    addChild() {},
    createGroup() {
      if (!this.$refs.newGroupForm.validate()) return;

      const obj = {
        parentMsisdn: this.parentProfile.msisdn,
        groupName: this.newGroupName,
      };
      this.closeAddGroupDialog();
      Vue.$http.post(`${this.basePrepaidUrl}/groups/create`, obj).then(
        (result) => {
          if (!result.errorMsgUssd) {
            this.parentProfile = result;
            this.showSnackbar("Group created successfully.", false);
          } else {
            this.showSnackbar(result.errorMsgUssd, true);
            console.error("Error while creating group: ", result.errorMsgUssd);
          }
        },
        (error) => {
          console.error("Error while creating group: ", error);
          this.showSnackbar(error, true);
        }
      );
    },
    closeAddGroupDialog() {
      this.$refs.newGroupForm.reset();
      this.$refs.newGroupForm.resetValidation();
      this.addGroupDialog = false;
    },
    showEditGroupDialog(existingGroupName) {
      this.groupEditRequest.existingGroupName = existingGroupName;
      this.newGroupName = existingGroupName;
      this.groupEditRequest.parentMsisdn = this.parentProfile.msisdn;
      this.editGroupDialog = true;
    },
    updateGroup() {
      if (!this.$refs.editGroupForm.validate()) return;
      this.groupEditRequest.newGroupName = this.newGroupName;
      this.closeEditGroupDialog();
      Vue.$http
        .post(`${this.basePrepaidUrl}/groups/update`, this.groupEditRequest)
        .then(
          (result) => {
            if (!result.errorMsgUssd) {
              console.log("Update group result: ", result);
              this.parentProfile = result;
              this.showSnackbar("Group updated successfully.", false);
            } else {
              console.error("Error while updating group.", result.errorMsgUssd);
              this.showSnackbar(result.errorMsgUssd, true);
            }
          },
          (error) => {
            console.error(error);
            this.showSnackbar(error, true);
          }
        );
    },
    closeEditGroupDialog() {
      this.editGroupDialog = false;
      this.$refs.editGroupForm.resetValidation();
      this.$refs.editGroupForm.reset();
    },
    showDeleteGroupDialog(groupName) {
      Swal.fire({
        title: `ARE YOU SURE YOU WANT TO DELETE ${groupName}?`,
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#fd2222",
        customClass: "swal-wide",
        confirmButtonText: "YES",
        reverseButtons: true,
        cancelButtonText: "NO",
      }).then((result) => {
        if (result.value) {
          this.deleteGroup(groupName);
        }
      });
    },
    deleteGroup(groupName) {
      const groupDeleteRequest = {
        groupName: groupName,
        parentMsisdn: this.parentProfile.msisdn,
      };
      Vue.$http
        .post(`${this.basePrepaidUrl}/groups/delete`, groupDeleteRequest)
        .then(
          (result) => {
            if (!result.errorMsgUssd) {
              this.parentProfile = result;
              this.showSnackbar("Group deleted successfully", false);
            } else {
              this.showSnackbar(result.errorMsgUssd, true);
            }
          },
          (error) => {
            console.error("Failed to delete group.", error);
            this.showSnackbar(error, true);
          }
        );
    },
    showAddUserDialog(groupName) {
      this.newUserRequest.groupName = groupName;
      this.newUserRequest.parentMsisdn = this.parentProfile.msisdn;
      this.addUserDialog = true;
    },
    closeAddUserDialog() {
      this.addUserDialog = false;
      this.$refs.addUserForm.resetValidation();
      this.$refs.addUserForm.reset();
    },
    addUser() {
      if (!this.$refs.addUserForm.validate()) return;

      this.newUserRequest.memberMsisdn = this.newUserMsisdn;
      this.closeAddUserDialog();
      console.log("Sending new user request.", this.newUserRequest);
      Vue.$http
        .post(`${this.basePrepaidUrl}/groups/addMember`, this.newUserRequest)
        .then(
          (result) => {
            this.newUserRequest = {};

            if (!result.errorMsgUssd) {
              this.parentProfile = result;
              this.showSnackbar("User added successfully", false);
            } else {
              this.showSnackbar(result.errorMsgUssd, true);
            }
          },
          (error) => {
            console.error("Failed to add user. ", error);
            this.showSnackbar(error, true);
          }
        );
    },
    showUpdateChildMsisdnDialog(groupIndex, msisdn) {
      this.updateChildMsisdnRequest.groupNumber = groupIndex + 1;
      this.updateChildMsisdnRequest.oldMemberMsisdn = msisdn;
      this.updateChildMsisdnRequest.parentMsisdn = this.parentProfile.msisdn;
      this.updatedChildMsisdn = msisdn;
      this.updateChildMsisdnDialog = true;
    },
    closeUpdateChildMsisdnDialog() {
      this.updateChildMsisdnDialog = false;
      this.$refs.updateChildMsisdnForm.resetValidation();
      this.$refs.updateChildMsisdnForm.reset();
    },
    updateChildMsisdn() {
      if (!this.$refs.updateChildMsisdnForm.validate()) return;

      this.updateChildMsisdnRequest.newMemberMsisdn = this.updatedChildMsisdn;
      this.closeUpdateChildMsisdnDialog();
      console.log(
        "Sending update child request: ",
        this.updateChildMsisdnRequest
      );
      Vue.$http
        .post(
          `${this.basePrepaidUrl}/groups/updateMember`,
          this.updateChildMsisdnRequest
        )
        .then(
          (result) => {
            console.log(result);
            if (!result.errorMsgUssd) {
              this.getParentProfile();
              this.updateChildMsisdnRequest = {};
              this.showSnackbar("Member updated successfully.", false);
            } else {
              this.showSnackbar(result.errorMsgUssd, true);
            }
          },
          (error) => {
            console.error("Failed to updatechild Msisdn. ", error);
            this.showSnackbar(error, true);
          }
        );
    },
    showDeleteChildDialog(groupNumber, msisdn) {
      Swal.fire({
        title: `ARE YOU SURE YOU WANT TO DELETE ${msisdn}?`,
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#fd2222",
        customClass: "swal-wide",
        confirmButtonText: "YES",
        reverseButtons: true,
        cancelButtonText: "NO",
      }).then((result) => {
        if (result.value) {
          this.deleteChild(groupNumber, msisdn);
        }
      });
    },
    deleteChild(groupNumber, msisdn) {
      const childDeleteRequest = {
        groupNumber: groupNumber + 1,
        memberMsisdn: msisdn,
        parentMsisdn: this.parentProfile.msisdn,
      };
      Vue.$http
        .post(`${this.basePrepaidUrl}/groups/deleteMember`, childDeleteRequest)
        .then(
          (result) => {
            if (!result.errorMsgUssd) {
              this.parentProfile = result;
              this.showSnackbar("Member deleted successfully", false);
            } else {
              this.showSnackbar(result.errorMsgUssd, true);
            }
          },
          (error) => {
            console.error("Failed to delete child.", error);
            this.showSnackbar(error, true);
          }
        );
    },
    showSubscribeDialog(groupName) {
      this.subscribeDialog = true;
    },
    closeSubscribeDialog() {
      this.subscribeDialog = false;
    },

    isNumber(evt) {
      return utils.isNumber(evt);
    },
    showSnackbar(message, isError) {
      this.snackbarColor = isError ? "error" : "info";
      this.timeout = isError ? 10000 : 5000;
      this.snackbarText = message;
      this.snackbar = true;
    },
  },
  mounted() {
    this.basePrepaidUrl = sessionStorage.getItem(ApiUrls.BASE_PREPAID_URL_KEY);
    this.parentMsisdn = sessionStorage.getItem("ParentMSISDN");

    if (!this.parentMsisdn) {
      this.$store
        .commit("notis/setAlert", {
          type: "error",
          title: "Parent MSISDN Not Found.",
          time: "4",
        })
        .then(() => {
          this.$router.push({ name: "fpUserType" });
        });
    }
    this.getParentProfile();
    this.getBundles();
  },
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
.card-content {
  padding: 16px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-basis: auto;
}
</style>
