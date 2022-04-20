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
            <p href title="Daily Subscription" class="animation">
              Daily Subscription
            </p>
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
              ></v-text-field>
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
      </div>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-3">
          <v-text-field
            v-model="parentMsisdn"
            name="ParentMsisdn"
            label="Parent Msisdn"
          ></v-text-field>
        </div>
        <div class="col-md-3">
          <v-select
            :clearable="true"
            :items="statuses"
            label="Status"
            v-model="status"
          ></v-select>
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
              :fetch="fetchData"
              :fields="json_fields"
              type="csv"
              name="Daily Subscription.xls"
              >Download Excel</download-excel
            >
          </v-btn>
        </div>
      </div>
      <div>
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
                props.item.parentDetails ? props.item.parentDetails.msisdn : "-"
              }}
            </td>
            <td>{{ props.item.created ? props.item.created : "-" }}</td>
            <td>
              {{
                props.item.newPricePlanDetails
                  ? props.item.newPricePlanDetails.name
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.newPricePlanDetails
                  ? props.item.newPricePlanDetails.lineRent
                  : "-"
              }}
            </td>
            <td>{{ props.item.channel ? props.item.channel : "-" }}</td>
            <td>
              {{
                props.item.transactionStatus
                  ? props.item.transactionStatus
                  : "-"
              }}
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
import moment from "moment";
import utils from "../../utils";
import Vue from "vue";

export default {
  data() {
    return {
      statuses: [
        { text: "PENDING", value: "PENDING" },
        { text: "SUCCESS", value: "SUCCESS" },
        { text: "FAILED", value: "FAILED" },
        { text: "CANCELLED", value: "CANCELLED" },
      ],
      baseReportUrl: utils.getBaseReportUrl(),
      search: "",
      json_fields: {
        Number: {
          field: "parentDetails",
          callback: (parentDetails) => {
            if (parentDetails) {
              return parentDetails.msisdn;
            } else {
              return "-";
            }
          },
        },
        "Date of Subscription": {
          field: "created",
          callback: (created) => {
            if (created) {
              return created;
            } else {
              return "-";
            }
          },
        },
        "Price Plan": {
          field: "newPricePlanDetails",
          callback: (newPricePlanDetails) => {
            if (newPricePlanDetails) {
              return newPricePlanDetails.name;
            } else {
              return "-";
            }
          },
        },
        "Line Rent Amount": {
          field: "newPricePlanDetails",
          callback: (newPricePlanDetails) => {
            if (newPricePlanDetails) {
              return newPricePlanDetails.lineRent;
            } else {
              return "-";
            }
          },
        },
        Channel: {
          field: "channel",
          callback: (channel) => {
            if (channel) {
              return channel;
            } else {
              return "-";
            }
          },
        },
        Status: {
          field: "transactionStatus",
          callback: (transactionStatus) => {
            if (transactionStatus) {
              return transactionStatus;
            } else {
              return "-";
            }
          },
        },
      },
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
          text: "Number",
          value: "Number",
          sortable: false,
        },
        {
          text: "DateofSubscription",
          value: "DateofSubscription",
          sortable: false,
        },
        {
          text: "PricePlan",
          value: "PricePlan",
          sortable: false,
        },
        {
          text: "Line Rent Amount",
          value: "LineRentAmount",
          sortable: false,
        },
        {
          text: "Channel",
          value: "Channel",
          sortable: false,
        },
        {
          text: "Status",
          value: "Status",
          sortable: false,
        },
      ],
      consentReport: [],
      exportData: [],
      dateMenuFrom: false,
      dateMenuTo: false,
      parentMsisdn: "",
      status: "",
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
          name: "report.subscription",
          query: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            startDate: this.startDate,
            endDate: this.endDate,
            ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
            ...(this.status && { status: this.status }),
          },
        })
        .catch((error) => {
          this.$router.push("/");
          this.$router.push({
            name: "report.subscription",
            query: {
              page: this.pagination.page,
              rowsPerPage: this.pagination.rowsPerPage,
              startDate: this.startDate,
              endDate: this.endDate,
              ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
              ...(this.status && { status: this.status }),
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
          parentMsisdn: this.parentMsisdn,
          status: this.status,
          pageNumber: this.pagination.page,
          pageSize: isExport ? 999999 : this.pagination.rowsPerPage,
        };
        let query = utils.getQueryString(obj);
        await Vue.$http
          .get(
            this.baseReportUrl + "/reportdaily/subscriptionReportDaily" + query
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
        this.status = obj.status;
      }
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
};
</script>
<style>
</style>