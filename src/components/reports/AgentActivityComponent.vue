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
            <p href title="Agent Activity" class="animation">Agent Activity</p>
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
        <!-- <div class="col-md-3">
          <v-text-field v-model="eventType" name="eventType" label="Event Type"></v-text-field>
          <v-select
            :clearable="true"
            :multiple="true"
            :items="EventTypeList"
            item-text="description"
            item-value="eventType"
            label="Event Type"
            v-model="selectedEvent"
          ></v-select>
        </div> -->
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
            v-model="agentId"
            name="agentId"
            label="Agent Id"
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
              name="Agent Activity.xls"
              >Download Excel</download-excel
            >
          </v-btn>
        </div>
      </div>

      <div class="rs-table">
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
                props.item.userDetails
                  ? props.item.userDetails
                    ? props.item.userDetails.username
                    : "-"
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.transactionDetails
                  ? props.item.transactionDetails.parentDetails
                    ? props.item.transactionDetails.parentDetails.msisdn
                    : "-"
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.transactionDetails
                  ? props.item.transactionDetails.childDetails
                    ? props.item.transactionDetails.childDetails.msisdn
                    : "-"
                  : "-"
              }}
            </td>
            <td>{{ props.item.eventData ? props.item.eventData : "-" }}</td>
            <td>
              {{
                props.item.transactionDetails
                  ? IsParentOpCode(
                      props.item.transactionDetails.opcodeDetails
                        ? props.item.transactionDetails.opcodeDetails.opcode
                        : ""
                    )
                    ? "PARENT"
                    : "CHILD"
                  : "_"
              }}
            </td>
            <td>
              {{
                props.item.transactionDetails
                  ? props.item.transactionDetails.opcodeDetails
                    ? props.item.transactionDetails.opcodeDetails.description
                    : "-"
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
            <td>{{ props.item.created ? props.item.created : "-" }}</td>
            <td>
              {{
                props.item.transactionDetails
                  ? props.item.transactionDetails.channel
                  : "-"
              }}
            </td>
            <td>
              {{
                props.item.transactionDetails
                  ? props.item.transactionDetails.productDetails
                    ? props.item.transactionDetails.productDetails.productName
                    : "-"
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
              {{ props.item.oldPricePlan ? props.item.oldPricePlan : "-" }}
            </td>
            <td>
              {{ props.item.newPricePlan ? props.item.newPricePlan : "-" }}
            </td>
            <td>{{ props.item.eventStatus ? props.item.eventStatus : "-" }}</td>
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
            <td>
              {{
                props.item.transactionDetails
                  ? props.item.transactionDetails.systemTransactionId
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
      EventTypeList: [],
      selectedEvent: [],
      search: "",
      json_fields: {
        AgentId: {
          field: "userDetails",
          callback: (userDetails) => {
            if (userDetails) {
              return userDetails.username;
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
        "Event Data": {
          field: "eventData",
          callback: (eventData) => {
            if (eventData) {
              return eventData;
            } else {
              return "-";
            }
          },
        },
        "Subscriber Type": {
          field: "transactionDetails",
          callback: (transactionDetails) => {
            if (transactionDetails && transactionDetails.opcodeDetails) {
              return this.IsParentOpCode(
                transactionDetails.opcodeDetails.opcode
              )
                ? "PARENT"
                : "CHILD";
            } else {
              return "-";
            }
          },
        },
        "Activity Type": {
          field: "transactionDetails",
          callback: (transactionDetails) => {
            if (transactionDetails && transactionDetails.opcodeDetails) {
              return transactionDetails.opcodeDetails.description;
            } else {
              return "-";
            }
          },
        },
        "Event Type": {
          field: "eventDetails",
          callback: (eventDetails) => {
            if (eventDetails) {
              return eventDetails.eventDescription;
            } else {
              return "-";
            }
          },
        },
        "Date & Time": "created",
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
        "Old Price Plan": {
          field: "oldPricePlan",
          callback: (oldPricePlan) => {
            if (oldPricePlan) {
              return oldPricePlan;
            } else {
              return "-";
            }
          },
        },
        "New Price Plan": {
          field: "newPricePlan",
          callback: (newPricePlan) => {
            if (newPricePlan) {
              return newPricePlan;
            } else {
              return "-";
            }
          },
        },
        "Event Status": {
          field: "eventStatus",
          callback: (eventStatus) => {
            if (eventStatus) {
              return eventStatus;
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
          text: "AgentId",
          value: "AgentId",
          sortable: false,
        },
        {
          text: "User Type",
          value: "User Type",
          sortable: false,
        },
        {
          text: "Parent Number",
          value: "ParentNumber",
          sortable: false,
        },
        {
          text: "Child Number",
          value: "ChildNumber",
          sortable: false,
        },
        {
          text: "Event Data",
          value: "eventData",
          sortable: false,
        },
        {
          text: "Subscriber Type",
          value: "SubscriberType",
          sortable: false,
        },
        {
          text: "Activity Type",
          value: "ActivityType",
          sortable: false,
        },
        {
          text: "Event Type",
          value: "EventType",
          sortable: false,
        },
        {
          text: "Date & Time",
          value: "DateAndTime",
          sortable: false,
        },
        {
          text: "Request Channel",
          value: "RequestChannel",
          sortable: false,
        },
        {
          text: "Resources Type",
          value: "ResourcesType",
          sortable: false,
        },
        {
          text: "Quota Allocated",
          value: "QuotaAllocated",
          sortable: false,
        },
        {
          text: "Old Price Plan",
          value: "OldPricePlan",
          sortable: false,
        },
        {
          text: "New Price Plan",
          value: "NewPricePlan",
          sortable: false,
        },
        {
          text: "Event Status",
          value: "NewPricePlan",
          sortable: false,
        },

        {
          text: "Updated Child Resources",
          value: "UpdatedChildResources",
          sortable: false,
        },
        {
          text: "Updated Parents Resources",
          value: "UpdatedParentsResources",
          sortable: false,
        },
        {
          text: "TransactionId",
          value: "TransactionId",
          sortable: false,
        },
      ],
      consentReport: [],
      exportData: [],
      dateMenuFrom: false,
      dateMenuTo: false,
      parentMsisdn: "",
      //   eventType: "",
      eventTypes: "",
      childMsisdn: "",
      agentId: "",
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

    IsParentOpCode(opcode) {
      if (
        ["ADD_PARENT", "REMOVE_PARENT", "CHANGE_PRICE_PLAN"].includes(opcode)
      ) {
        return true;
      } else {
        return false;
      }
    },
    navigateToSearch() {
      if (this.selectedEvent) {
        this.eventTypes = this.selectedEvent.toString();
      }
      this.$router
        .push({
          name: "report.agentctivity",
          query: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            startDate: this.startDate,
            endDate: this.endDate,
            ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
            ...(this.childMsisdn && { childMsisdn: this.childMsisdn }),
            ...(this.agentId && { agentId: this.agentId }),
            ...(this.eventTypes && { eventTypes: this.eventTypes }),
          },
        })
        .catch((error) => {
          this.$router.push("/");
          this.$router.push({
            name: "report.agentctivity",
            query: {
              page: this.pagination.page,
              rowsPerPage: this.pagination.rowsPerPage,
              startDate: this.startDate,
              endDate: this.endDate,
              ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn }),
              ...(this.childMsisdn && { childMsisdn: this.childMsisdn }),
              ...(this.agentId && { agentId: this.agentId }),
              ...(this.eventTypes && { eventTypes: this.eventTypes }),
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
          agentId: this.agentId,
          eventType: this.eventTypes,
        };
        let query = utils.getQueryString(obj);
        await this.$http
          .get(
            window.ReportBaseURL +
              "/reportdaily/agentActivityReportDaily" +
              query
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
        this.agentId = obj.agentId;
        this.eventTypes = obj.eventTypes;
        if (obj.eventTypes) {
          this.selectedEvent = obj.eventTypes.split(",");
        }
      }
    },
    /*  getEventTypes() {
      Vue.$http
        .post(window.ReportBaseURL + "/general/getReportEventTypes", {})
        .then(result => {
          if (result.errorCode == "00") {
            this.EventTypeList = result.data;
          }
        });
    }*/
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
    //this.getEventTypes();
  },
  beforeDestroy() {},
};
</script>
<style>
.rs-table table thead th,
.rs-table table tbody td {
  padding: 0 10px !important;
}
</style>