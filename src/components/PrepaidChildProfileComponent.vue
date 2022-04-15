<template>
  <div>
    <div class="row">
      <!-- v-bind:class="{ redish: child.childProfile.status!='ACTIVE' }" -->
      <form
        class="col-md-12 pl-3 pr-3"
        @submit.prevent="handleFpChileUser(child)"
      >
        <div class="row pt-2">
          <div class="col-md-12">
            <h5 class="single-line user-heading">
              USER {{ childIndex }} PROFILE
            </h5>
            <!-- <span
              title="Edit"
              class="cursor-pointer"
              @click="canEdit(child)"
            >
              <i class="material-icons">edit</i>
            </span> -->
            <span
              v-if="!child.parent"
              title="Delete"
              class="cursor-pointer pl-2"
              @click="deleteChild(child)"
            >
              <i class="material-icons">delete_forever</i>
            </span>
            <!-- <span               title="Unsubscribe"
              class="cursor-pointer pl-2"
              @click="UnsubscribeChild(child)"
            >
              <i class="material-icons">link_off</i>
            </span>
            <span 
              title="terminate"
              class="cursor-pointer pl-2"
              @click="terminateChild(child)"
            >
                <i class="material-icons">link_off</i>
            </span> -->
          </div>
          <div class="col-md-5">
            <div class="row">
              <div class="col-sm-12">
                <h5 class="mt-3">
                  MSISDN: {{ child.msisdn }}
                  <span
                    v-if="!child.parent"
                    title="Update MSISDN"
                    class="pl-2 cursor-pointer"
                    @click="updateMsisdn"
                  >
                    <i class="material-icons">edit</i>
                  </span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </form>
      <!-- <hr size="50" style="width:100%;border:1px solid #007bff" /> -->
    </div>
    <v-divider></v-divider>
  </div>
</template>
<script>
import utils from "../utils";

export default {
  props: {
    child: {},
    parentMsisdn: String,
    parentId: String,
    childIndex: Number,
    parentMonthlyBalance: {},
    selectedPricePlan: {},
  },
  data: () => ({
    componentKey: 0,
    changeChildMSISDN: {
      parentMsisdn: "",
      oldChildMsisdn: "",
      newChildMsisdn: "",
    },
    childInChange: {},
    childDetail: {
      canChange: true,
      panel1: [true],
      panel2: [true],
      childProfile: {
        id: "",
        msisdn: "",
      },
      childMonthlyBalance: [
        {
          childProductId: {
            childId: "",
            productId: "",
          },
          monthlyQuota: 0,
          totalQuota: 0,
          remainingQuota: 0,
        },
      ],
      childOneTimeBalance: [
        {
          childProductId: {
            childId: "",
            productId: "",
          },
          monthlyQuota: 0,
          totalQuota: 0,
          remainingQuota: 0,
        },
      ],
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
              unit: "ACTUAL",
            },
          ],
        },
      ],
    },

    childAccounts: [],
    products: [],
    monthlyQuota: [],
    OTQuota: [],
    loading: false,
    submitted: false,
  }),
  methods: {
    updateMsisdn() {
      this.$emit("updateMsisdn");
    },
    deleteChild() {
      this.$emit("delete");
    },
    getTotalQuota(product) {
      return "";
    },
    getRemainingQuota(product) {
      let value = "";
      return value;
    },

    forceRerender() {
      this.componentKey += 1;
    },
    canEdit(child) {},
    stopEdit(child) {},
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

    UnsubscribeChild(child) {},

    terminateChild(child) {},

    handleFpChileUser(child, index) {},
    validateForm(child, index) {},

    updateUserMSISDN() {},
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.updateUserMSISDN();
    },
    addChild() {
      this.childAccounts.push(JSON.parse(JSON.stringify(this.childDetail)));
    },
    getmonthlyQuota(child, index) {
      this.monthlyQuota = [];
      return this.monthlyQuota;
    },
    getOTQuota(child, index) {
      this.OTQuota = [];
      return this.OTQuota;
    },
    IsSaveDisabled(child) {
      let isDisabled = true;
      return isDisabled;
    },
    getChildAllocationPct(product, child, index) {
      let value = "0.00";
      return value;
    },
    getChildMonthlyBalance(child, product) {
      let value = 0;
      if (child.childMonthlyConfig) {
        let childProduct = child.childMonthlyConfig.find(
          (m) => m.childProductId.productId == product.productId
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
        oldChildMsisdn: child.msisdn,
        newChildMsisdn: "",
      };
      this.childInChange = child;
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
    },
  },
  mounted() {},
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