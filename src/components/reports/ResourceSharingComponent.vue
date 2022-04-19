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
            <p href title="Resource Sharing" class="animation">
              Resource Sharing
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
          <v-text-field
            v-model="childMsisdn"
            name="ChildMsisdn"
            label="Child Msisdn"
          ></v-text-field>
        </div>
        <div class="col-md-3">
          <v-text-field
            v-model="transactionId"
            name="TransactionId"
            label="Transaction Id"
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
              :fetch="fetchData"
              :fields="json_fields"
              type="csv"
              name="Resource Sharing.xls"
              >Download Excel</download-excel
            >
          </v-btn>
        </div>
      </div>

      <div class="rs-table">
        <!-- text-break -->
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
                props.item.transactionDetails
                  ? props.item.transactionDetails.systemTransactionId
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.transactionDetails.parentDetails
                  ? props.item.transactionDetails.parentDetails.msisdn
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.transactionDetails.childDetails
                  ? props.item.transactionDetails.childDetails.msisdn
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.eventDetails
                  ? props.item.eventDetails.eventDescription
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.productDetails
                  ? props.item.productDetails.productName
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.convertedAllocationAmount
                  ? props.item.convertedAllocationAmount
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.convertedNewChildBalance
                  ? props.item.convertedNewChildBalance
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.convertedNewParentBalance
                  ? props.item.convertedNewParentBalance
                  : "-"
              }}
            </td>
            <td>{{ props.item.eventStatus ? props.item.eventStatus : "-" }}</td>
            <td>
              {{
                props.item.transactionDetails
                  ? props.item.transactionDetails.channel
                  : "-"
              }}
            </td>
            <td>{{ props.item.created ? props.item.created : "-" }}</td>
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
      baseReportUrl: utils.getBaseReportUrl(),
      search: "",
      json_fields: {
        TransactionId: {
          field: "transactionDetails",
          callback: (transactionDetails) => {
            if (transactionDetails) {
              return transactionDetails.systemTransactionId;
            } else {
              return "-";
            }
          },
        },
        "Parent Number": {
          field: "transactionDetails",
          callback: (transactionDetails) => {
            if (transactionDetails && transactionDetails.parentDetails) {
              return transactionDetails.parentDetails.msisdn;
            } else {
              return "-";
            }
          },
        },
        "Child Number": {
          field: "transactionDetails",
          callback: (transactionDetails) => {
            if (transactionDetails && transactionDetails.childDetails) {
              return transactionDetails.childDetails.msisdn;
            } else {
              return "-";
            }
          },
        },
        "Type of Event": {
          field: "eventDetails",
          callback: (eventDetails) => {
            if (eventDetails) {
              return eventDetails.eventDescription;
            } else {
              return "-";
            }
          },
        },
        "Resources Type": {
          field: "productDetails",
          callback: (productDetails) => {
            if (productDetails) {
              return productDetails.productName;
            } else {
              return "-";
            }
          },
        },
        "Quota Allocated": {
          field: "convertedAllocationAmount",
          callback: (convertedAllocationAmount) => {
            if (convertedAllocationAmount) {
              return convertedAllocationAmount;
            } else {
              return "-";
            }
          },
        },
        "Updated Child Resources": {
          field: "convertedNewChildBalance",
          callback: (convertedNewChildBalance) => {
            if (convertedNewChildBalance) {
              return convertedNewChildBalance;
            } else {
              return "-";
            }
          },
        },
        "Updated Parents Resources": {
          field: "convertedNewParentBalance",
          callback: (convertedNewParentBalance) => {
            if (convertedNewParentBalance) {
              return convertedNewParentBalance;
            } else {
              return "-";
            }
          },
        },
        Status: {
          field: "eventStatus",
          callback: (eventStatus) => {
            if (eventStatus) {
              return eventStatus;
            } else {
              return "-";
            }
          },
        },
        "Request Channel": {
          field: "transactionDetails",
          callback: (transactionDetails) => {
            if (transactionDetails) {
              return transactionDetails.channel;
            } else {
              return "-";
            }
          },
        },
        "Date & Time": "created",
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
          text: "Transaction Id",
          value: "TransactionID",
          sortable: false,
          width: "5%",
        },
        {
          text: "Parent Number",
          value: "ParentNumber",
          sortable: false,
          width: "5%",
        },
        {
          text: "Child Number",
          value: "ChildNumber",
          sortable: false,
          width: "5%",
        },
        {
          text: "Type of Event",
          value: "TypeofEvent",
          sortable: false,
          width: "30%",
        },
        {
          text: "Resource Type",
          value: "ResourceType",
          sortable: false,
          width: "9%",
        },
        {
          text: "Quota Allocated",
          value: "QuotaAllocated",
          sortable: false,
          width: "9%",
        },
        {
          text: "Updated Child Resources",
          value: "UpdatedChildResources",
          sortable: false,
          width: "9%",
        },
        {
          text: "Updated Parent Resources",
          value: "UpdatedParentResources",
          sortable: false,
          width: "9%",
        },
        { text: "Status", value: "Status", sortable: false, width: "9%" },
        { text: "Channel", value: "Channel", sortable: false },
        { text: "Date & Time", value: "DateAndTime", sortable: false },
      ],
      consentReport: [],
      exportData: [],
      dateMenuFrom: false,
      dateMenuTo: false,
      parentMsisdn: "",
      childMsisdn: "",
      transactionId: "",
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
          name: "report.resource",
          query: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            startDate: this.startDate,
            endDate: this.endDate,
            ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
            ...(this.childMsisdn && { childMsisdn: this.childMsisdn }),
            ...(this.transactionId && { transactionId: this.transactionId }),
          },
        })
        .catch((error) => {
          this.$router.push("/");
          this.$router.push({
            name: "report.resource",
            query: {
              page: this.pagination.page,
              rowsPerPage: this.pagination.rowsPerPage,
              startDate: this.startDate,
              endDate: this.endDate,
              ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
              ...(this.childMsisdn && { childMsisdn: this.childMsisdn }),
              ...(this.transactionId && { transactionId: this.transactionId }),
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
          pageNumber: this.pagination.page,
          pageSize: isExport ? 999999 : this.pagination.rowsPerPage,
          childMsisdn: this.childMsisdn,
          parentMsisdn: this.parentMsisdn,
          transactionId: this.transactionId,
        };
        let query = utils.getQueryString(obj);
        await Vue.$http
          .get(
            `${this.baseReportUrl}/reportdaily/resourceSharingEventReportDaily${query}`
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
        this.childMsisdn = obj.childMsisdn;
        this.transactionId = obj.transactionId;
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
.rs-table table thead th,
.rs-table table tbody td {
  padding: 0 10px !important;
}
</style>