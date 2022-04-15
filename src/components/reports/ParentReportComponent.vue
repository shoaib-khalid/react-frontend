<template>
  <div class="pl-5 pr-5 pt-2">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <ul class="breadCrumbs">
          <li>
            <a href title="Home" class="animation">Home</a>
          </li>
          <li>
            <router-link to="/report/list">Reports</router-link>
          </li>
          <li class="activePage">
            <p href title="Parent Report" class="animation">Parent Report</p>
          </li>
          <div class="clear"></div>
        </ul>
      </div>
    </div>
    <div v-if="!errorMsg">
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-3">
          <v-menu
            v-model="dateMenuFrom"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startDate"
                name="Date From"
                v-validate="'required'"
                label="From"
                prepend-icon="event"
                readonly
                v-on="on"
                :error-messages="errors.first('Date From')"
              >
              </v-text-field>
            </template>
            <v-date-picker
              :max="endDate"
              v-model="startDate"
              @input="dateMenuFrom = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div class="col-md-3">
          <v-menu
            v-model="dateMenuTo"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endDate"
                name="Date Until"
                v-validate="'required'"
                label="Until"
                prepend-icon="event"
                readonly
                v-on="on"
                :error-messages="errors.first('Date Until')"
              ></v-text-field>
            </template>
            <v-date-picker
              :min="startDate"
              v-model="endDate"
              @input="dateMenuTo = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div class="col-md-3">
          <v-text-field
            v-model="parentMsisdn"
            name="ParentMsisdn"
            label="Parent Msisdn"
          ></v-text-field>
        </div>
        <div class="col-md-2">
          <v-btn round color="#3498db" @click="navigateToSearch" dark
            >Search</v-btn
          >
        </div>
      </div>

      <div class="row pb-2">
        <div class="col-md-2">
          <v-btn round color="#3498db" dark>
            <download-excel
              :escapeCsv="false"
              :fetch="fetchData"
              :fields="json_fields"
              type="csv"
              name="ParentReport.xls"
              >Download Excel</download-excel
            >
          </v-btn>
        </div>
      </div>

      <div class="rs-table text-center">
        <v-data-table
          :headers="headers"
          :items="tableData"
          :pagination.sync="pagination"
          :total-items="pagination.totalItems"
          :rows-per-page-items="[10]"
        >
          <template v-slot:items="props">
            <td>
              {{
                props.item.subscriptionDate ? props.item.subscriptionDate : "-"
              }}
            </td>
            <td>
              {{
                props.item.subscriberFranchise
                  ? props.item.subscriberFranchise
                  : "-"
              }}
            </td>
            <td>
              {{ props.item.parentMsisdn ? props.item.parentMsisdn : "-" }}
            </td>
            <td>
              {{ props.item.childMsisdn ? props.item.childMsisdn : "All" }}
            </td>
            <td>{{ props.item.childStatus ? props.item.childStatus : "-" }}</td>
            <td>{{ props.item.pricePlan ? props.item.pricePlan : "-" }}</td>
            <td>
              {{ props.item.totalChildern ? props.item.totalChildern : "0" }}
            </td>
            <td>
              {{
                props.item.currentChildern ? props.item.currentChildern : "0"
              }}
            </td>
            <td>{{ props.item.caOnnetMins ? props.item.caOnnetMins : "0" }}</td>
            <td>
              {{ props.item.caOffnetMins ? props.item.caOffnetMins : "0" }}
            </td>
            <td>{{ props.item.caData ? props.item.caData : "0" }}</td>
            <td>{{ props.item.caSms ? props.item.caSms : "0" }}</td>
            <td>{{ props.item.otOnnetMins ? props.item.otOnnetMins : "0" }}</td>
            <td>
              {{ props.item.otOffnetMins ? props.item.otOffnetMins : "0" }}
            </td>
            <td>{{ props.item.otData ? props.item.otData : "0" }}</td>
            <td>{{ props.item.otSms ? props.item.otSms : "0" }}</td>
            <td>
              {{ props.item.mthlyOnnetMins ? props.item.mthlyOnnetMins : "0" }}
            </td>
            <td>
              {{
                props.item.mthlyOffnetMins ? props.item.mthlyOffnetMins : "0"
              }}
            </td>
            <td>{{ props.item.mthlyData ? props.item.mthlyData : "0" }}</td>
            <td>{{ props.item.mthlySms ? props.item.mthlySms : "0" }}</td>
            <td>
              {{ props.item.addOnOnnetMins ? props.item.addOnOnnetMins : "0" }}
            </td>
            <td>
              {{
                props.item.addOnOffnetMins ? props.item.addOnOffnetMins : "0"
              }}
            </td>
            <td>{{ props.item.addOnData ? props.item.addOnData : "0" }}</td>
            <td>{{ props.item.addOnSms ? props.item.addOnSms : "0" }}</td>
            <td>
              {{ props.item.billingCycle ? props.item.billingCycle : "-" }}
            </td>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning"
              >Your search for "{{ search }}" found no results.</v-alert
            >
          </template>
        </v-data-table>
      </div>
    </div>
    <div v-if="errorMsg">
      <div style="width: 100%; height: 100%" class="card">
        <div class="card-block p-5">
          <h3>{{ errorMsg }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import utils from "../../utils";

export default {
  data() {
    return {
      baseReportUrl: "",
      search: "",
      json_fields: {
        "Subscription Date": {
          field: "subscriptionDate",
          callback: (subscriptionDate) => {
            if (subscriptionDate) {
              return subscriptionDate;
            } else {
              return "-";
            }
          },
        },
        "Franchise Id": {
          field: "subscriberFranchise",
          callback: (subscriberFranchise) => {
            if (subscriberFranchise) {
              return subscriberFranchise;
            } else {
              return "-";
            }
          },
        },
        "Parent Msisdn": {
          field: "parentMsisdn",
          callback: (parentMsisdn) => {
            if (parentMsisdn) {
              return parentMsisdn;
            } else {
              return "-";
            }
          },
        },
        "Child Msisdn": {
          field: "childMsisdn",
          callback: (childMsisdn) => {
            if (childMsisdn) {
              return childMsisdn;
            } else {
              return "-";
            }
          },
        },
        "Child Status": {
          field: "childStatus",
          callback: (childStatus) => {
            if (childStatus) {
              return childStatus;
            } else {
              return "-";
            }
          },
        },
        "Price Plan": {
          field: "pricePlan",
          callback: (pricePlan) => {
            if (pricePlan) {
              return pricePlan;
            } else {
              return "-";
            }
          },
        },
        "Total Childs": {
          field: "totalChildern",
          callback: (totalChildern) => {
            if (totalChildern) {
              return totalChildern;
            } else {
              return "-";
            }
          },
        },
        "Current Children": {
          field: "currentChildern",
          callback: (currentChildern) => {
            if (currentChildern) {
              return currentChildern;
            } else {
              return "-";
            }
          },
        },
        "Allocated Telenor Mins": {
          field: "caOnnetMins",
          callback: (caOnnetMins) => {
            if (caOnnetMins) {
              return caOnnetMins;
            } else {
              return "-";
            }
          },
        },
        "Allocated Other Mins": {
          field: "caOffnetMins",
          callback: (caOffnetMins) => {
            if (caOffnetMins) {
              return caOffnetMins;
            } else {
              return "-";
            }
          },
        },
        "Allocated Data": {
          field: "caData",
          callback: (caData) => {
            if (caData) {
              return caData;
            } else {
              return "-";
            }
          },
        },
        "Allocated SMS": {
          field: "caSms",
          callback: (caSms) => {
            if (caSms) {
              return caSms;
            } else {
              return "-";
            }
          },
        },
        "One Time Telenor Mins": {
          field: "otOnnetMins",
          callback: (otOnnetMins) => {
            if (otOnnetMins) {
              return otOnnetMins;
            } else {
              return "-";
            }
          },
        },
        "One Time Other Mins": {
          field: "otOffnetMins",
          callback: (otOffnetMins) => {
            if (otOffnetMins) {
              return otOffnetMins;
            } else {
              return "-";
            }
          },
        },
        "One Time Data": {
          field: "otData",
          callback: (otData) => {
            if (otData) {
              return otData;
            } else {
              return "-";
            }
          },
        },
        "One Time SMS": {
          field: "otSms",
          callback: (otSms) => {
            if (otSms) {
              return otSms;
            } else {
              return "-";
            }
          },
        },
        "Monthly Telenor Mins": {
          field: "mthlyOnnetMins",
          callback: (mthlyOnnetMins) => {
            if (mthlyOnnetMins) {
              return mthlyOnnetMins;
            } else {
              return "-";
            }
          },
        },
        "Monthly Other Mins": {
          field: "mthlyOffnetMins",
          callback: (mthlyOffnetMins) => {
            if (mthlyOffnetMins) {
              return mthlyOffnetMins;
            } else {
              return "-";
            }
          },
        },
        "Monthly Data": {
          field: "mthlyData",
          callback: (mthlyData) => {
            if (mthlyData) {
              return mthlyData;
            } else {
              return "-";
            }
          },
        },
        "Monthy SMS": {
          field: "mthlySms",
          callback: (mthlySms) => {
            if (mthlySms) {
              return mthlySms;
            } else {
              return "-";
            }
          },
        },
        "Bundle Telenor Mins": {
          field: "addOnOnnetMins",
          callback: (addOnOnnetMins) => {
            if (addOnOnnetMins) {
              return addOnOnnetMins;
            } else {
              return "-";
            }
          },
        },
        "Bundle Other Mins": {
          field: "addOnOffnetMins",
          callback: (addOnOffnetMins) => {
            if (addOnOffnetMins) {
              return addOnOffnetMins;
            } else {
              return "-";
            }
          },
        },
        "Bundle Data": {
          field: "addOnData",
          callback: (addOnData) => {
            if (addOnData) {
              return addOnData;
            } else {
              return "-";
            }
          },
        },
        "Bundle SMS": {
          field: "addOnSms",
          callback: (addOnSms) => {
            if (addOnSms) {
              return addOnSms;
            } else {
              return "-";
            }
          },
        },
        "Billing Cycle": {
          field: "billingCycle",
          callback: (billingCycle) => {
            if (billingCycle) {
              return billingCycle;
            } else {
              return "-";
            }
          },
        },
      },
      loading: false,
      items: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalPages: undefined,
        totalItems: undefined,
      },
      errorMsg: "",
      headers: [
        {
          text: "Subscription Date",
          value: "subscriptionDate",
          sortable: false,
          align: "center",
        },
        {
          text: "Franchise Id",
          value: "subscriberFranchise",
          sortable: false,
          align: "center",
        },
        {
          text: "Parent Msisdn",
          value: "parentMsisdn",
          sortable: false,
          align: "center",
        },
        {
          text: "Child Msisdn",
          value: "childMsisdn",
          sortable: false,
          align: "center",
        },
        {
          text: "Child Status",
          value: "childStatus",
          sortable: false,
          align: "center",
        },
        {
          text: "Price Plan",
          value: "pricePlan",
          sortable: false,
          align: "center",
        },
        {
          text: "Total Childern",
          value: "totalChildern",
          sortable: false,
          align: "center",
        },
        {
          text: "Current Children",
          value: "currentChildern",
          sortable: false,
          align: "center",
        },
        {
          text: "Allocated Telenor Mins",
          value: "caOnnetMins",
          align: "center",
          sortable: false,
        },
        {
          text: "Allocated Other Mins",
          value: "caOffnetMins",
          align: "center",
          sortable: false,
        },
        {
          text: "Allocated Data",
          value: "caData",
          align: "center",
          sortable: false,
        },
        {
          text: "Allocated SMS",
          value: "caSms",
          align: "center",
          sortable: false,
        },
        {
          text: "One Time Telenor Mins",
          value: "otOnnetMins",
          align: "center",
          sortable: false,
        },
        {
          text: "One Time Other Mins",
          value: "otOffnetMins",
          align: "center",
          sortable: false,
        },
        {
          text: "One Time Data",
          value: "otData",
          align: "center",
          sortable: false,
        },
        {
          text: "One Time SMS",
          value: "otSms",
          align: "center",
          sortable: false,
        },
        {
          text: "‏Monthly Telenor Mins",
          value: "mthlyOnnetMins",

          align: "center",
          sortable: false,
        },
        {
          text: "‏Monthly Other Mins",
          value: "mthlyOffnetMins",

          align: "center",
          sortable: false,
        },
        {
          text: "‏Monthly Data",
          value: "mthlyData",

          align: "center",
          sortable: false,
        },
        {
          text: "‏Monthly SMS",
          value: "mthlySms",

          align: "center",
          sortable: false,
        },
        {
          text: "Bundle Telenor Mins",
          value: "addOnOnnetMins",

          align: "center",
          sortable: false,
        },

        {
          text: "Bundle Other Mins",
          value: "addOnOffnetMins",

          align: "center",
          sortable: false,
        },
        {
          text: "Bundle Data",
          value: "addOnData",

          align: "center",
          sortable: false,
        },
        {
          text: "Bundle SMS",
          value: "addOnSms",

          align: "center",
          sortable: false,
        },
        {
          text: "Billing Cycle",
          value: "billingCycle",
          sortable: false,
          align: "center",
        },
      ],
      consentReport: [],
      exportData: [],
      dateMenuFrom: false,
      dateMenuTo: false,
      parentMsisdn: "",
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    };
  },
  watch: {
    pagination: function (news, olds) {
      this.navigateToSearch();
    },
    "$route.query": function () {
      this.getReport();
    },
  },
  methods: {
    async fetchData() {
      let data = await this.getReport(true);
      return data;
    },
    navigateToSearch() {
      this.$router
        .push({
          name: "report.parentReport",
          query: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            startDate: this.startDate,
            endDate: this.endDate,
            ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
          },
        })
        .catch((error) => {
          this.$router.push("/");
          this.$router.push({
            name: "report.parentReport",
            query: {
              page: this.pagination.page,
              rowsPerPage: this.pagination.rowsPerPage,
              startDate: this.startDate,
              endDate: this.endDate,
              ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
            },
          });
        });
    },
    async getReport(isExport = false) {
      this.setModelFromQueryParams();
      if (
        this.pagination.page &&
        this.pagination.rowsPerPage &&
        this.startDate &&
        this.endDate
      ) {
        let obj = {
          startDate: this.startDate,
          endDate: this.endDate,
          pageNumber: isExport ? 1 : this.pagination.page,
          pageSize: isExport ? 999999 : this.pagination.rowsPerPage,
          parentMsisdn: this.parentMsisdn,
        };
        let query = utils.getQueryString(obj);
        await Vue.$http
          .get(
            `${this.baseReportUrl}/transaction/getParentResourceSharingReport${query}`
          )
          .then((result) => {
            if (result.errorCode == "00") {
              if (isExport) {
                this.exportData = result.data.content;
              } else {
                this.consentReport = result.data.content;
                this.pagination.totalPages = result.data.totalPages;
                this.pagination.totalItems = result.data.totalElements;
              }
            } else if (result.errorCode == "53") {
              this.errorMsg = result.errorMsg;
            }
          });
        return this.exportData;
      }
    },
    setModelFromQueryParams() {
      let obj = this.$route.query;
      if (obj) {
        this.pagination.page = obj.page ? obj.page : this.pagination.page;
        this.pagination.rowsPerPage = obj.rowsPerPage
          ? obj.rowsPerPage
          : this.pagination.rowsPerPage;
        this.startDate = obj.startDate
          ? obj.startDate
          : moment().subtract(1, "months").format("YYYY-MM-DD");
        this.endDate = obj.endDate
          ? obj.endDate
          : moment().format("YYYY-MM-DD");
        this.parentMsisdn = obj.parentMsisdn;
      }
    },
    //format date
    formatDate(datetime) {
      let date = new Date(datetime).toJSON().slice(0, 10);
      return date;
    },
  },
  computed: {
    tableData: function () {
      return this.consentReport.map((data) => {
        data.consentSentTime = moment(
          data.consentSentTime,
          "YYYY-MM-DD HH:mm:ss"
        ).format("DD/MM/YYYY HH:mm:ss");
        data.consentExpiryTime = moment(
          data.consentExpiryTime,
          "YYYY-MM-DD HH:mm:ss"
        ).format("DD/MM/YYYY HH:mm:ss");
        return data;
      });
    },
  },
  mounted() {
    this.baseReportUrl = utils.getBaseReportUrl();
  },
  beforeDestroy() {},
};
</script>
<style>
.rs-table table thead th,
.rs-table table tbody td {
  padding: 0 5px !important;
}
</style>