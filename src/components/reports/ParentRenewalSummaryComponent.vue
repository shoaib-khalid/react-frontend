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
            <p href title="Parent Summary Report" class="animation">
              Parent Renewal Summary
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
              name="ParentRenewalSummary.xls"
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
            <td>{{ props.item.date ? props.item.date : "-" }}</td>
            <td>
              {{
                props.item.twoLinesNewSubscriptions
                  ? props.item.twoLinesNewSubscriptions
                  : "_"
              }}
            </td>
            <td>
              {{
                props.item.threeLinesNewSubscriptions
                  ? props.item.threeLinesNewSubscriptions
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fourLinesNewSubscriptions
                  ? props.item.fourLinesNewSubscriptions
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fiveLinesNewSubscriptions
                  ? props.item.fiveLinesNewSubscriptions
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.twoLinesTotalActive
                  ? props.item.twoLinesTotalActive
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.threeLinesTotalActive
                  ? props.item.threeLinesTotalActive
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fourLinesTotalActive
                  ? props.item.fourLinesTotalActive
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fiveLinesTotalActive
                  ? props.item.fiveLinesTotalActive
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.twoLinesUnSubscriptions
                  ? props.item.twoLinesUnSubscriptions
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.threeLinesUnSubscriptions
                  ? props.item.threeLinesUnSubscriptions
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fourLinesUnSubscriptions
                  ? props.item.fourLinesUnSubscriptions
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fiveLinesUnSubscriptions
                  ? props.item.fiveLinesUnSubscriptions
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.twoLinesUpgrade ? props.item.twoLinesUpgrade : "-"
              }}
            </td>
            <td>
              {{
                props.item.threeLinesUpgrade
                  ? props.item.threeLinesUpgrade
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fourLinesUpgrade ? props.item.fourLinesUpgrade : "-"
              }}
            </td>
            <td>
              {{
                props.item.fiveLinesUpgrade ? props.item.fiveLinesUpgrade : "-"
              }}
            </td>
            <td>
              {{
                props.item.twoLinesDowngrade
                  ? props.item.twoLinesDowngrade
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.threeLinesDowngrade
                  ? props.item.threeLinesDowngrade
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fourLinesDowngrade
                  ? props.item.fourLinesDowngrade
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fiveLinesDowngrade
                  ? props.item.fiveLinesDowngrade
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.twoLinesRenewalCount
                  ? props.item.twoLinesRenewalCount
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.threeLinesRenewalCount
                  ? props.item.threeLinesRenewalCount
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fourLinesRenewalCount
                  ? props.item.fourLinesRenewalCount
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.fiveLinesRenewalCount
                  ? props.item.fiveLinesRenewalCount
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
import Vue from "vue";
import moment from "moment";
import utils from "../../utils";

export default {
  data() {
    return {
      baseReportUrl: utils.getBaseReportUrl(),
      search: "",
      json_fields: {
        Date: {
          field: "date",
          callback: (date) => {
            if (date) {
              return date;
            } else {
              return "0";
            }
          },
        },
        "2L New Sub": {
          field: "twoLinesNewSubscriptions",
          callback: (twoLinesNewSubscriptions) => {
            if (twoLinesNewSubscriptions) {
              return twoLinesNewSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "3L New Sub": {
          field: "threeLinesNewSubscriptions",
          callback: (threeLinesNewSubscriptions) => {
            if (threeLinesNewSubscriptions) {
              return threeLinesNewSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "4L New Sub": {
          field: "fourLinesNewSubscriptions",
          callback: (fourLinesNewSubscriptions) => {
            if (fourLinesNewSubscriptions) {
              return fourLinesNewSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "5L New Sub": {
          field: "fiveLinesNewSubscriptions",
          callback: (fiveLinesNewSubscriptions) => {
            if (fiveLinesNewSubscriptions) {
              return fiveLinesNewSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "2L Active": {
          field: "twoLinesTotalActive",
          callback: (twoLinesTotalActive) => {
            if (twoLinesTotalActive) {
              return twoLinesTotalActive;
            } else {
              return "0";
            }
          },
        },
        "3L Active": {
          field: "threeLinesTotalActive",
          callback: (threeLinesTotalActive) => {
            if (threeLinesTotalActive) {
              return threeLinesTotalActive;
            } else {
              return "0";
            }
          },
        },
        "4L Active": {
          field: "fourLinesTotalActive",
          callback: (fourLinesTotalActive) => {
            if (fourLinesTotalActive) {
              return fourLinesTotalActive;
            } else {
              return "0";
            }
          },
        },
        "5L Active": {
          field: "fiveLinesTotalActive",
          callback: (fiveLinesTotalActive) => {
            if (fiveLinesTotalActive) {
              return fiveLinesTotalActive;
            } else {
              return "0";
            }
          },
        },
        "2L Unsub": {
          field: "twoLinesUnSubscriptions",
          callback: (twoLinesUnSubscriptions) => {
            if (twoLinesUnSubscriptions) {
              return twoLinesUnSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "3L Unsub": {
          field: "threeLinesUnSubscriptions",
          callback: (threeLinesUnSubscriptions) => {
            if (threeLinesUnSubscriptions) {
              return threeLinesUnSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "4L Unsub": {
          field: "fourLinesUnSubscriptions",
          callback: (fourLinesUnSubscriptions) => {
            if (fourLinesUnSubscriptions) {
              return fourLinesUnSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "5L Unsub": {
          field: "fiveLinesUnSubscriptions",
          callback: (fiveLinesUnSubscriptions) => {
            if (fiveLinesUnSubscriptions) {
              return fiveLinesUnSubscriptions;
            } else {
              return "0";
            }
          },
        },
        "2L Upgrade": {
          field: "twoLinesUpgrade",
          callback: (twoLinesUpgrade) => {
            if (twoLinesUpgrade) {
              return mthlySms;
            } else {
              return "0";
            }
          },
        },
        "3L Upgrade": {
          field: "threeLinesUpgrade",
          callback: (threeLinesUpgrade) => {
            if (threeLinesUpgrade) {
              return threeLinesUpgrade;
            } else {
              return "0";
            }
          },
        },
        "4L Upgrade": {
          field: "fourLinesUpgrade",
          callback: (fourLinesUpgrade) => {
            if (fourLinesUpgrade) {
              return fourLinesUpgrade;
            } else {
              return "0";
            }
          },
        },
        "5L Upgrade": {
          field: "fiveLinesUpgrade",
          callback: (fiveLinesUpgrade) => {
            if (fiveLinesUpgrade) {
              return fiveLinesUpgrade;
            } else {
              return "0";
            }
          },
        },
        "2L Downgrade": {
          field: "twoLinesDowngrade",
          callback: (twoLinesDowngrade) => {
            if (twoLinesDowngrade) {
              return twoLinesDowngrade;
            } else {
              return "0";
            }
          },
        },
        "3L Downgrade": {
          field: "threeLinesDowngrade",
          callback: (threeLinesDowngrade) => {
            if (threeLinesDowngrade) {
              return threeLinesDowngrade;
            } else {
              return "0";
            }
          },
        },
        "4L Downgrade": {
          field: "fourLinesDowngrade",
          callback: (fourLinesDowngrade) => {
            if (fourLinesDowngrade) {
              return fourLinesDowngrade;
            } else {
              return "0";
            }
          },
        },
        "5L Downgrade": {
          field: "fiveLinesDowngrade",
          callback: (fiveLinesDowngrade) => {
            if (fiveLinesDowngrade) {
              return fiveLinesDowngrade;
            } else {
              return "0";
            }
          },
        },
        "2L Renewal": {
          field: "twoLinesRenewalCount",
          callback: (twoLinesRenewalCount) => {
            if (twoLinesRenewalCount) {
              return twoLinesRenewalCount;
            } else {
              return "0";
            }
          },
        },
        "3L Renewal": {
          field: "threeLinesRenewalCount",
          callback: (threeLinesRenewalCount) => {
            if (threeLinesRenewalCount) {
              return threeLinesRenewalCount;
            } else {
              return "0";
            }
          },
        },
        "4L Renewal": {
          field: "fourLinesRenewalCount",
          callback: (fourLinesRenewalCount) => {
            if (fourLinesRenewalCount) {
              return fourLinesRenewalCount;
            } else {
              return "0";
            }
          },
        },
        "5L Renewal": {
          field: "fiveLinesRenewalCount",
          callback: (fiveLinesRenewalCount) => {
            if (fiveLinesRenewalCount) {
              return fiveLinesRenewalCount;
            } else {
              return "0";
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
          text: "Date",
          value: "date",
          sortable: false,
          align: "right",
        },

        {
          text: "2L New Sub",
          value: "twoLinesNewSubscriptions",
          sortable: false,
          align: "center",
        },
        {
          text: "3L New Sub",
          value: "threeLinesNewSubscriptions",
          align: "center",
          sortable: false,
        },
        {
          text: "4L New Sub",
          value: "fourLinesNewSubscriptions",
          align: "center",
          sortable: false,
        },
        {
          text: "5L New Sub",
          value: "fiveLinesNewSubscriptions",
          align: "center",
          sortable: false,
        },
        {
          text: "2L Active",
          value: "twoLinesTotalActive",

          align: "center",
          sortable: false,
        },
        {
          text: "3L Active",
          value: "threeLinesTotalActive",
          sortable: false,
          align: "center",
        },
        {
          text: "4L Active",
          value: "fourLinesTotalActive",

          align: "center",
          sortable: false,
        },
        {
          text: "5L Active",
          value: "fiveLinesTotalActive",
          sortable: false,
          align: "center",
        },
        {
          text: "2L Unsub",
          value: "twoLinesUnSubscriptions",
          align: "center",
          sortable: false,
        },
        {
          text: "3L Unsub",
          value: "threeLinesUnSubscriptions",

          align: "center",
          sortable: false,
        },
        {
          text: "‏4L Unsub",
          value: "fourLinesUnSubscriptions",

          align: "center",
          sortable: false,
        },
        {
          text: "5L Unsub",
          value: "fiveLinesUnSubscriptions",
          align: "center",
          sortable: false,
        },
        {
          text: "2L Upgrade",
          value: "twoLinesUpgrade",

          align: "center",
          sortable: false,
        },
        {
          text: "3L Upgrade",
          value: "threeLinesUpgrade",
          align: "center",
          sortable: false,
        },

        {
          text: "4L Upgrade",
          value: "fourLinesUpgrade",

          align: "center",
          sortable: false,
        },
        {
          text: "5L Upgrade",
          value: "fiveLinesUpgrade",
          align: "center",
          sortable: false,
        },
        {
          text: "2L Downgrade",
          value: "twoLinesDowngrade",

          align: "center",
          sortable: false,
        },
        {
          text: "3L Downgrade",
          value: "threeLinesDowngrade",
          align: "center",
          sortable: false,
        },

        {
          text: "4L Downgrade",
          value: "fourLinesDowngrade",

          align: "center",
          sortable: false,
        },
        {
          text: "5L Downgrade",
          value: "fiveLinesDowngrade",
          align: "center",
          sortable: false,
        },
        {
          text: "2L Renewal",
          value: "twoLinesRenewalCount",
          sortable: false,
          align: "center",
        },
        {
          text: "3L Renewal",
          value: "threeLinesRenewalCount",
          sortable: false,
          align: "center",
        },
        {
          text: "4L Renewal",
          value: "fourLinesRenewalCount",
          sortable: false,
          align: "center",
        },
        {
          text: "5L Renewal",
          value: "fiveLinesRenewalCount",
          sortable: false,
          align: "center",
        },
      ],
      consentReport: [],
      exportData: [],
      dateMenuFrom: false,
      dateMenuTo: false,
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
          name: "report.ParentRenewalSummary",
          query: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            startDate: this.startDate,
            endDate: this.endDate,
          },
        })
        .catch((error) => {
          this.$router.push("/");
          this.$router.push({
            name: "report.ParentRenewalSummary",
            query: {
              page: this.pagination.page,
              rowsPerPage: this.pagination.rowsPerPage,
              startDate: this.startDate,
              endDate: this.endDate,
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
        };
        let query = utils.getQueryString(obj);
        await Vue.$http
          .get(this.baseReportUrl + "/transaction/getSummaryReport" + query)
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
};
</script>
<style>
.rs-table table thead th,
.rs-table table tbody td {
  padding: 0 5px !important;
}
</style>