<template>
  <div>
    <div
      class="row"
      :key="'child' + i"
      v-for="(child, i) in childAccounts"
      v-bind:class="{ redish: child.childProfile.status!='ACTIVE' }"
    >
      <form class="col-md-12 pl-3 pr-3" @submit.prevent="handleFpChileUser(child,i)">
        <div class="row pt-2">
          <div class="col-md-12">
            <h5 class="single-line user-heading">USER {{ ('0' + (i+1)).slice(-2)}} PROFILE</h5>
            <span
              title="Edit"
              v-if="child.childProfile.id"
              class="cursor-pointer"
              @click="canEdit(child)"
            >
              <i class="material-icons">edit</i>
            </span>
            <span title="Delete" class="cursor-pointer pl-2" @click="DeleteChild(child)">
              <i class="material-icons">delete_forever</i>
            </span>
            <span
              v-if="0>1"
              title="Unsubscribe"
              class="cursor-pointer pl-2"
              @click="UnsubscribeChild(child)"
            >
              <i class="material-icons">link_off</i>
            </span>
          </div>
          <div class="col-md-5">
            <div class="row">
              <div class="col-sm-12">
                <v-text-field
                  v-if="!child.childProfile.id"
                  v-model="child.childProfile.msisdn"
                  v-validate="'required'"
                  pattern="^\d{11}$"
                  @keypress="IsNumber($event)"
                  v-mask="'###########'"
                  type="text"
                  :error-messages="errors.collect(`MSISDN${i}`)"
                  :data-vv-name="`MSISDN${i}`"
                  :data-vv-as="'MSISDN'"
                  label="MSISDN"
                ></v-text-field>
                <h5 class="mt-3" v-if="child.childProfile.id">
                  MSISDN: {{child.childProfile.msisdn}}
                  <span
                    title="Update MSISDN"
                    class="pl-2 cursor-pointer"
                    v-b-modal.modal-updateUser
                    @click="ChangeNumber(child)"
                  >
                    <i class="material-icons">edit</i>
                  </span>
                </h5>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <template>
                  <v-expansion-panel expand v-model="child.panel1">
                    <v-expansion-panel-content :key="'v-expansion-panel-content_1'">
                      <template v-slot:header>
                        <div class="font-weight-bold">
                          MONTHLY SHARING
                          <br />
                          <span class="small">(WILL BE POSTED ON MONTHLY RENEWAL)</span>
                        </div>
                      </template>
                      <v-card>
                        <div class="row pl-2 pr-2" :key="`MONTHLY_SHARING_KEY${componentKey}`">
                          <template v-for="(product, j) in selectedPricePlan.productList">
                            <div
                              :key="'product' + j"
                              class="col-sm-6"
                              v-if="product.isShareable==1"
                            >
                              <v-text-field
                                :id="'child_monthly'+(child.childProfile.id ? child.childProfile.id : i)+'_'+product.productId"
                                v-validate="'required'"
                                v-mask="'#########'"
                                :value="getChildMonthlyBalance(child,product)"
                                @keypress="IsValidValue($event,product)"
                                type="text"
                                :disabled="!child.canChange"
                                :error-messages="errors.collect(`${product.productInfo.productName+i}`)"
                                title="Enter Value"
                                :data-vv-name="`${product.productInfo.productName+i}`"
                                :data-vv-as="product.productInfo.productName"
                                :suffix="`= ${getChildAllocationPct(product, child, i)} %`"
                              >
                                <template slot="label">
                                  <label style="font-size:0.8em">{{product.productInfo.productName}}</label>
                                </template>
                              </v-text-field>
                            </div>
                          </template>
                        </div>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </template>
                <template>
                  <v-expansion-panel expand v-model="child.panel2">
                    <v-expansion-panel-content :key="'v-expansion-panel-content_2'">
                      <template v-slot:header>
                        <div class="font-weight-bold">
                          ONE-TIME SHARING
                          <br />
                          <span class="small">(WILL BE POSTED INSTANTLY AND WILL NOT BE RENEWAL)</span>
                        </div>
                      </template>
                      <v-card>
                        <div class="row pl-2 pr-2" :key="`ONE-TIME_SHARING_kEY${componentKey}`">
                          <template v-for="(product, j) in parentMonthlyBalance">
                            <div
                              :key="'product' + j"
                              class="col-sm-6"
                              v-if="product.isFPService==1"
                            >
                              <v-text-field
                                :id="'child_onetime'+ (child.childProfile.id ? child.childProfile.id : i) +'_'+product.parentProductId.productId"
                                v-validate="'required'"
                                :value="0"
                                @keypress="IsNumber($event)"
                                pattern="^\d*"
                                v-mask="'######'"
                                type="text"
                                :error-messages="errors.collect(`${product.productDetails.productName+'OT'+i}`)"
                                title="Enter Value"
                                :data-vv-name="`${product.productDetails.productName+'OT'+i}`"
                                :disabled="!child.canChange"
                                :data-vv-as="product.productDetails.productName"
                              >
                                <template slot="label">
                                  <label
                                    style="font-size:0.8em"
                                  >{{product.productDetails.productName}}</label>
                                </template>
                              </v-text-field>
                            </div>
                          </template>
                        </div>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </template>
              </div>
            </div>
          </div>
          <div class="col-md-7 align-self-center" v-if="child.childProfile.id">
            <div
              class="row"
              v-if="((child.childMonthlyBalance && child.childMonthlyBalance.length>0) || (child.childOneTimeBalance && child.childOneTimeBalance.length>0))"
            >
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-bordered-outside table-striped small">
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
                        v-for="(product, i) in child.childMonthlyBalance"
                      >
                        <td>{{ getTotalQuota(product) }}</td>
                        <td>{{ getRemainingQuota(product) }}</td>
                        <td>Monthly Sharing</td>
                        <td>{{product.applyDate | formatDate}}</td>
                        <td>{{product.expiryDate | formatDate}}</td>
                      </tr>
                      <tr
                        :key="'product_rem' + i"
                        v-for="(product, i) in child.childOneTimeBalance"
                      >
                        <td>{{ getTotalQuota(product) }}</td>
                        <td>{{ getRemainingQuota(product) }}</td>
                        <td>One Time Bundle Sharing</td>
                        <td>{{product.applyDate | formatDate}}</td>
                        <td>{{product.expiryDate | formatDate}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="row"></div>
          </div>
          <div class="col-md-12 text-right" v-if="child.canChange">
            <v-btn
              type="button"
              round
              :disabled="loading"
              color="#e74c3c"
              @click="stopEdit(child)"
              style="width:100px"
              class="mr-2"
            >Cancel</v-btn>
            <v-btn
              type="submit"
              round
              :disabled="IsSaveDisabled(child,i)"
              color="#3498db"
              style="width:100px"
            >Save</v-btn>
          </div>
        </div>
      </form>
      <hr size="50" style="width:100%;border:1px solid #007bff" />
    </div>
    <div class="row pl-4" v-if="childAccounts.length < (numberOfLines-1)">
      <i @click="addChild()" class="material-icons font-lg cursor-pointer">add_circle_outline</i>
      <span class="text-uppercase pl-2 pt-3">
        <h5>add user {{ ('0' + (childAccounts.length+1)).slice(-2)}}</h5>
      </span>
    </div>
    <b-modal id="modal-updateUser" ref="modal" @ok="handleOk" size="sm" title="UPDATE USER:">
      <form ref="form" @submit.stop.prevent="updateUserMSISDN">
        <v-text-field
          v-validate="'required'"
          pattern="^\d{12}$"
          type="text"
          v-model="changeChildMSISDN.oldChildMsisdn"
          :error-messages="errors.collect('Existing MSISDN')"
          data-vv-name="Existing MSISDN"
          label="Existing MSISDN"
          @keypress="IsNumber($event)"
          v-mask="'############'"
          autofocus
          disabled
        ></v-text-field>
        <v-text-field
          v-validate="'required'"
          pattern="^\d{11}$"
          @keypress="IsNumber($event)"
          v-mask="'###########'"
          type="text"
          v-model="changeChildMSISDN.newChildMsisdn"
          :error-messages="errors.collect('New MSISDN')"
          data-vv-name="New MSISDN"
          label="New MSISDN"
        ></v-text-field>
      </form>
      <template v-slot:modal-footer="{cancel ,ok}">
        <v-btn
          type="reset"
          :small="true"
          round
          :disabled="loading"
          @click="cancel()"
          class="my-cancel-btn"
        >Cancel</v-btn>
        <v-btn
          type="submit"
          :small="true"
          round
          :disabled="loading"
          class="my-save-btn"
          @click="ok()"
        >Save</v-btn>
      </template>
    </b-modal>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import Vue from "vue";
import utils from "../utils";

export default {
  props: {
    parentMsisdn: String,
    parentId: String,
    numberOfLines: Number,
    parentMonthlyBalance: {},
    selectedPricePlan: {}
  },
  data: () => ({
    componentKey: 0,
    changeChildMSISDN: {
      parentMsisdn: "",
      oldChildMsisdn: "",
      newChildMsisdn: ""
    },
    childInChange: {},
    childDetail: {
      canChange: true,
      panel1: [true],
      panel2: [true],
      childProfile: {
        id: "",
        msisdn: ""
      },
      childMonthlyBalance: [
        {
          childProductId: {
            childId: "",
            productId: ""
          },
          monthlyQuota: 0,
          totalQuota: 0,
          remainingQuota: 0
        }
      ],
      childOneTimeBalance: [
        {
          childProductId: {
            childId: "",
            productId: ""
          },
          monthlyQuota: 0,
          totalQuota: 0,
          remainingQuota: 0
        }
      ]
    },

    childDataToPost: {
      parentMsisdn: "",
      childDetails: [
        {
          childMsisdn: "",
          monthlyQuota: [
            {
              productId: "",
              quota: undefined,
              unit: "ACTUAL"
            }
          ]
        }
      ]
    },

    childAccounts: [],
    products: [],
    monthlyQuota: [],
    OTQuota: [],
    loading: false,
    submitted: false
  }),
  methods: {
    getTotalQuota(product) {
      let value = "";
      if (product.productDetails.quotaUnit == "BYTE") {
        value =
          this.formatBytesToMbs(product.totalQuota) +
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
          this.formatBytesToMbs(product.remainingQuota) +
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

    forceRerender() {
      this.componentKey += 1;
    },
    canEdit(child) {
      child.canChange = true;
      child.panel1 = [true];
      child.panel2 = [true];
      this.forceRerender();
    },
    stopEdit(child) {
      if (child.childProfile.id) {
        child.canChange = false;
        child.panel1 = [false];
        child.panel2 = [false];
      } else {
        this.childAccounts.splice(this.childAccounts.indexOf(child), 1);
        this.emitChildDeleted();
      }
      this.forceRerender();
    },
    IsNumber(evt) {
      return utils.isNumber(evt);
    },
    IsValidValue(evt, product) {
      let value = product.amount;
      if (product.productInfo.quotaUnit == "BYTE") {
        value = this.formatBytesToMbs(value);
      } else if (product.productInfo.quotaUnit == "SECOND") {
        value = utils.convertSecondsToMins(value);
      }
      return utils.isNumber(evt, value);
    },
    DeleteChild(child) {
      Swal.fire({
        // title: "",
        text: "ARE YOU SURE YOU WANT TO DELETE?",
        // icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#fd2222",
        customClass: "swal-wide",
        confirmButtonText: "YES",
        reverseButtons: true,
        cancelButtonText: "NO"
      }).then(result => {
        if (result.value) {
          if (child.childProfile.id) {
            let _childToDelete = {
              parentMsisdn: this.parentMsisdn,
              childMsisdn: child.childProfile.msisdn
            };
            Vue.$http
              .post("/child/deleteChildFromParent", _childToDelete)
              .then(result => {
                if (result.errorCode == "00") {
                  this.$store.commit("notis/setAlert", {
                    type: "success",
                    title: result.errorMsg,
                    time: "4"
                  });
                  this.childAccounts.splice(
                    this.childAccounts.indexOf(child),
                    1
                  );
                  this.emitChildDeleted();
                } else
                  this.$store.commit("notis/setAlert", {
                    type: "error",
                    title: result.errorMsg,
                    time: "4"
                  });
              });
          } else {
            this.childAccounts.splice(this.childAccounts.indexOf(child), 1);
            this.emitChildDeleted();
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: "Successfull delete child",
              time: "4"
            });
          }
        }
      });
    },
    UnsubscribeChild(child) {
      Swal.fire({
        text: "ARE YOU SURE YOU WANT TO UNSUBSCRIBE?",
        showCancelButton: true,
        confirmButtonColor: "#feae23",
        cancelButtonColor: "#fd2222",
        customClass: "swal-wide",
        confirmButtonText: "YES",
        reverseButtons: true,
        cancelButtonText: "NO"
      }).then(result => {
        if (result.value) {
          if (child.childProfile.id) {
            let _childToUnsub = {
              parentMsisdn: this.parentMsisdn,
              childMsisdn: child.childProfile.msisdn
            };
            Vue.$http.post("/child/unsubChild", _childToUnsub).then(result => {
              if (result.errorCode == "00") {
                this.$store.commit("notis/setAlert", {
                  type: "success",
                  title: result.errorMsg,
                  time: "4"
                });
              } else
                this.$store.commit("notis/setAlert", {
                  type: "error",
                  title: result.errorMsg,
                  time: "4"
                });
            });
          }
        }
      });
    },
    handleFpChileUser(child, index) {
      let _this = this;
      this.validateForm(child, index).then(status => {
        if (!status.includes(false)) {
          let _childDataToPost = JSON.parse(
            JSON.stringify(this.childDataToPost)
          );
          let _monthlyQuota = this.getmonthlyQuota(child, index);
          let _oTQuota = this.getOTQuota(child, index);
          _childDataToPost.parentMsisdn = this.parentMsisdn;
          _childDataToPost.childDetails = [
            {
              childMsisdn: child.childProfile.msisdn,
              monthlyQuota: _monthlyQuota,
              OTQuota: _oTQuota
            }
          ];
          if (child.childProfile.id) {
            this.submitted = true;
            Vue.$http
              .post("/child/updateChildQuota", _childDataToPost)
              .then(result => {
                if (result.errorCode == "00") {
                  this.$store.commit("notis/setAlert", {
                    type: "success",
                    title: result.errorMsg,
                    time: "4"
                  });
                  _this.getChildProfile(child).then(_child => {
                    child.childProfile = _child.childProfile;
                    child.childMonthlyBalance = _child.childMonthlyBalance;
                    child.childOneTimeBalance = _child.childOneTimeBalance;
                  });
                  child.canChange = false;
                  child.panel1 = [false];
                  child.panel2 = [false];
                  _this.forceRerender();
                } else {
                  this.$store.commit("notis/setAlert", {
                    type: "error",
                    title: result.errorMsg,
                    time: "4"
                  });
                }
              });
          } else {
            this.submitted = true;
            Vue.$http
              .post("/child/addChildToParent", _childDataToPost)
              .then(result => {
                if (result.errorCode == "00") {
                  this.$store.commit("notis/setAlert", {
                    type: "success",
                    title: result.errorMsg,
                    time: "4"
                  });
                  child.canChange = false;
                  child.panel1 = [false];
                  child.panel2 = [false];
                  _this.getChildProfile(child).then(_child => {
                    child.childProfile = _child.childProfile;
                    child.childMonthlyBalance = _child.childMonthlyBalance;
                    child.childOneTimeBalance = _child.childOneTimeBalance;
                  });
                  _this.forceRerender();
                } else {
                  this.$store.commit("notis/setAlert", {
                    type: "error",
                    title: result.errorMsg,
                    time: "4"
                  });
                }
              });
          }
        }
      });
    },
    validateForm(child, index) {
      let validations = [];
      if (!child.childProfile.id) {
        validations.push(
          this.$validator.validate("MSISDN" + index, child.msisdn)
        );
      }
      this.selectedPricePlan.productList.forEach(product => {
        if (product.isFPService == 1) {
          let monthlyVal = "";
          let childMonthlytInput = document.getElementById(
            "child_monthly" +
              (child.childProfile.id ? child.childProfile.id : index) +
              "_" +
              product.productId
          );
          if (childMonthlytInput && childMonthlytInput.value) {
            monthlyVal = childMonthlytInput.value;
          }

          validations.push(
            this.$validator.validate(
              product.productInfo.productName + index,
              monthlyVal
            )
          );
        }
      });
      this.parentMonthlyBalance.forEach(product => {
        if (product.isFPService == 1) {
          let oneTimeVal = "";
          let childOneTimeInput = document.getElementById(
            "child_onetime" +
              (child.childProfile.id ? child.childProfile.id : index) +
              "_" +
              product.parentProductId.productId
          );
          if (childOneTimeInput && childOneTimeInput.value) {
            oneTimeVal = childOneTimeInput.value;
          }
          validations.push(
            this.$validator.validate(
              product.productDetails.productName + "OT" + index,
              oneTimeVal
            )
          );
        }
      });
      return Promise.all(validations);
    },

    updateUserMSISDN() {
      let _this = this;
      this.$validator.validateAll().then(status => {
        if (status) {
          if (
            _this.changeChildMSISDN.oldChildMsisdn ==
            _this.changeChildMSISDN.newChildMsisdn
          ) {
            this.$nextTick(() => {
              this.$store.commit("notis/setAlert", {
                type: "error",
                title: "New msisdns and old msisdn is same",
                time: "4"
              });
            });
          } else {
            this.$nextTick(() => {
              this.$refs.modal.hide();
            });
            Vue.$http
              .post("/child/replaceChildOfParent", _this.changeChildMSISDN)
              .then(result => {
                if (result.errorCode == "00") {
                  this.$store.commit("notis/setAlert", {
                    type: "success",
                    title: result.errorMsg,
                    time: "4"
                  });
                  // _this.childInChange.childProfile.msisdn =
                  //   _this.changeChildMSISDN.newChildMsisdn;
                  _this.forceRerender();
                } else {
                  this.$store.commit("notis/setAlert", {
                    type: "error",
                    title: result.errorMsg,
                    time: "4"
                  });
                }
              });
          }
        } else {
          return;
        }
      });
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.updateUserMSISDN();
    },
    addChild() {
      this.childAccounts.push(JSON.parse(JSON.stringify(this.childDetail)));
      this.emitChildAdded();
    },
    getChildsOfParent(parentMsisdn) {
      let obj = { parentMsisdn };
      Vue.$http.post("/parent/getChildsOfParent", obj).then(result => {
        if (result.errorCode == "00") {
          this.childAccounts = result.data.childDetails;
          this.childAccounts.forEach(child => {
            child.canChange = false;
            child.panel1 = [false];
            child.panel2 = [false];
          });
        }
      });
    },
    getChildProfile(child) {
      return new Promise((resolve, reject) => {
        let obj = { childMsisdn: child.childProfile.msisdn };
        Vue.$http.post("/child/getChildProfile", obj).then(result => {
          if (result.errorCode == "00") {
            resolve(result.data);
          } else {
            reject(result.errorMsg);
          }
        });
      });
    },
    getmonthlyQuota(child, index) {
     
      this.monthlyQuota = [];
      this.parentMonthlyBalance.forEach(product => {
          
        if (product.isFPService == "1") {
          let value = 0;
          let childProductInput = document.getElementById(
            "child_monthly" +
              (child.childProfile.id ? child.childProfile.id : index) +
              "_" +
              product.parentProductId.productId
          );
          if (childProductInput) {
            value = parseInt(childProductInput.value, 10);
          }
          value = this.convertToInternalUnits(
            product.productDetails.quotaUnit,
            value
          );
          let childValue = 0;
          if (child.childMonthlyConfig) {
            let childProduct = child.childMonthlyConfig.find(
              m =>
                m.childProductId.productId == product.parentProductId.productId
            );
            if (childProduct) {
              childValue = childProduct.monthlyQuota;
            }
          }
          if (childValue != value || window.SendAllChildResources) {
            let childMonthlyQuota = {
              productId: product.parentProductId.productId,
              quota: value,
              unit: "ACTUAL"
            };
            this.monthlyQuota.push(childMonthlyQuota);
          }
        }
      });
      return this.monthlyQuota;
    },
    getOTQuota(child, index) {
      this.OTQuota = [];
      this.parentMonthlyBalance.forEach(product => {
        if (product.isFPService == "1") {
          let value = 0;
          let childProductInput = document.getElementById(
            "child_onetime" +
              (child.childProfile.id ? child.childProfile.id : index) +
              "_" +
              product.parentProductId.productId
          );
          if (childProductInput) {
            value = parseInt(childProductInput.value, 10);
          }
          value = this.convertToInternalUnits(
            product.productDetails.quotaUnit,
            value
          );
          if (value > 0 || window.SendAllChildResources) {
            let childOTQuota = {
              productId: product.parentProductId.productId,
              quota: value,
              unit: "ACTUAL"
            };
            this.OTQuota.push(childOTQuota);
          }
        }
      });
      return this.OTQuota;
    },
    IsSaveDisabled(child) {
      let isDisabled = true;
      if (child.childProfile.id) {
        this.parentMonthlyBalance.forEach(product => {
          if (product.isFPService == 1) {
            let oneTimeVal = "";
            let childOneTimeInput = document.getElementById(
              "child_onetime" +
                child.childProfile.id +
                "_" +
                product.parentProductId.productId
            );
            if (childOneTimeInput && childOneTimeInput.value) {
              oneTimeVal = childOneTimeInput.value;
              if (oneTimeVal > 0) {
                isDisabled = false;
              }
            }
          }
        });
        if (this.selectedPricePlan) {
          this.selectedPricePlan.productList.forEach(product => {
            let productValue = undefined;
            let childProductVal = this.getChildMonthlyBalance(child, product);
            let childProductInput = document.getElementById(
              "child_monthly" + child.childProfile.id + "_" + product.productId
            );
            if (childProductInput) {
              if (childProductInput.value) {
                productValue = parseInt(childProductInput.value, 10);
              } else {
                isDisabled = true;
              }
              if (productValue >= 0 && productValue != childProductVal) {
                isDisabled = false;
              }
            }
          });
        }
      } else {
        isDisabled = false;
      }
      return isDisabled;
    },
    getChildAllocationPct(product, child, index) {
      let value = "0.00";
      let childProductInput = document.getElementById(
        "child_monthly" +
          (child.childProfile.id ? child.childProfile.id : index) +
          "_" +
          product.productId
      );
      if (childProductInput && childProductInput.value) {
        value = parseInt(childProductInput.value, 10);
      }
      if (product.amount > 0) {
        value = this.convertToInternalUnits(
          product.productInfo.quotaUnit,
          value
        );
        value = ((value / product.amount) * 100).toFixed(2);
      } else {
        value = "0.00";
      }
      return value;
    },
    getChildMonthlyBalance(child, product) {
      let value = 0;
      if (child.childMonthlyConfig) {
        let childProduct = child.childMonthlyConfig.find(
          m => m.childProductId.productId == product.productId
        );
        if (childProduct) {
          value = this.convertToDisplayUnits(
            childProduct.productDetails.quotaUnit,
            childProduct.monthlyQuota
          );
        }
      }
      return value;
    },
    ChangeNumber(child) {
      this.changeChildMSISDN = {
        parentMsisdn: this.parentMsisdn,
        oldChildMsisdn: child.childProfile.msisdn,
        newChildMsisdn: ""
      };
      this.childInChange = child;
    },
    emitChildAdded() {
      this.$emit("childAdded");
    },
    convertToDisplayUnits(quotaUnit, value) {
      if (quotaUnit == "BYTE") {
        value = this.formatBytesToMbs(value);
      } else if (quotaUnit == "SECOND") {
        value = this.convertSecondsToMins(value);
      }
      return value;
    },
    convertToInternalUnits(quotaUnit, value) {
      if (quotaUnit == "BYTE") {
        value = this.formatMBsToBytes(value);
      } else if (quotaUnit == "SECOND") {
        value = this.convertMinsToSeconds(value);
      }
      return value;
    },
    emitChildDeleted() {
      this.$emit("childDeleted");
    },
    formatBytesToMbs(bytes) {
      return utils.formatBytes(bytes);
    },
    convertSecondsToMins(seconds) {
      return utils.convertSecondsToMins(seconds);
    },
    convertMinsToSeconds(seconds) {
      return utils.convertMinsToSeconds(seconds);
    },
    formatMBsToBytes(bytes) {
      return utils.formatMBsToBytes(bytes);
    }
  },
  mounted() {
    this.getChildsOfParent(this.parentMsisdn);
  }
};
</script>
<style scoped>
.table th,
.table td {
  padding: 0.2rem !important;
}
.my-cancel-btn {
  width: 100px;
  background: #e74c3c !important;
}
.my-save-btn {
  width: 100px;
  background: #2ecc71 !important;
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








