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
                        <v-date-picker :max="endDate" v-model="startDate" @input="dateMenuFrom = false"></v-date-picker>
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
                        <v-date-picker :min="startDate" v-model="endDate" @input="dateMenuTo = false"></v-date-picker>
                    </v-menu>
                </div>
                <div class="col-md-3">
                    <v-text-field v-model="parentMsisdn" name="ParentMsisdn" label="Parent Msisdn"></v-text-field>
                </div>
                <div class="col-md-2">
                    <v-btn round color="#3498db" @click="navigateToSearch" dark>Search</v-btn>
                </div>
            </div>
            
            <div class="row pb-2">
                <div class="col-md-2">
                    <v-btn round color="#3498db" dark>
                        <download-excel
                          :fetch="fetchData"
                          :fields="json_fields"
                          type="csv"
                          name="Parent Report.xls"
                        >Download Excel</download-excel>
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
                        <td>{{ props.item.date ? props.item.date : "-"}}</td>
                        <td>{{ props.item.parentMsisdn ? props.item.parentMsisdn : "-" }}</td>
                        <td>{{ props.item.pricePlan ? props.item.pricePlan : "-" }}</td>
                        <td>{{ props.item.currentChildern? props.item.currentChildern :"-" }}</td>
                        <td>{{ props.item.otOnnetMins? props.item.otOnnetMins :"_"}}</td>
                        <td>{{ props.item.otOffnetMins? props.item.otOffnetMins:"-" }}</td>
                        <td>{{ props.item.otData ? props.item.otData :"-" }}</td>
                        <td>{{ props.item.otSms ? props.item.otSms :"-" }}</td>
                        <td>{{ props.item.mthlyOnnetMins ? props.item.mthlyOnnetMins :"-" }}</td>
                        <td>{{ props.item.mthlyOffnetMins?props.item.mthlyOffnetMins:"-" }}</td>
                        <td>{{ props.item.mthlyData ? props.item.mthlyData:"-" }}</td>
                        <td>{{ props.item.mthlySms ? props.item.mthlySms:"-" }}</td>
                        <td>{{ props.item.addOnOnnetMins ? props.item.addOnOnnetMins:"-" }}</td>
                        <td>{{ props.item.addOnOffnetMins ? props.item.addOnOffnetMins:"-" }}</td>
                        <td>{{ props.item.addOnData ? props.item.addOnData:"-" }}</td>
                        <td>{{ props.item.addOnSms ? props.item.addOnSms:"-" }}</td>
                        <td>{{ props.item.billingCycle?props.item.billingCycle :"-" }}</td>
                    </template> 
                    <template v-slot:no-results>
                        <v-alert
                          :value="true"
                          color="error"
                          icon="warning"
                        >Your search for "{{ search }}" found no results.</v-alert>
                    </template>
                </v-data-table>
            </div>
        </div>
        <div v-if="errorMsg">
            <div style="width:100%; height:100%" class="card">
                <div class="card-block p-5">
                    <h3>{{errorMsg}}</h3>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import moment from "moment";
import utils from "../../utils";

export default {
  data() {
    return {
      search: "",
      json_fields: {
        "Date": {
          field: "date",
          callback: date => {
            if (date) {
              return date;
            } else {
              return "-";
            }
          }
        },
        "Parent Msisdn": {
          field: "parentMsisdn",
          callback: parentMsisdn => {
            if (parentMsisdn) {
              return parentMsisdn;
            } else {
              return "-";
            }
          }
        },
        "Price Plan": {
          field: "pricePlan",
          callback: pricePlan => {
            if (pricePlan) {
              return pricePlan;
            } else {
              return "-";
            }
          }
        },
    /*    "Total Childs": {
          field: "totalChildern",
          callback: totalChildern => {
            if (totalChildern) {
              return totalChildern;
            } else {
              return "-";
            }
          }
        },*/
        "Current Children": {
          field: "currentChildern",
          callback: currentChildern => {
            if (currentChildern) {
              return currentChildern;
            } else {
              return "-";
            }
          }
        },
        "One Time Telenor Mins": {
          field: "otOnnetMins",
          callback: otOnnetMins => {
            if (otOnnetMins) {
              return otOnnetMins;
            } else {
              return "-";
            }
          }
        },
        "One Time Other Mins": {
          field: "otOffnetMins",
          callback: otOffnetMins => {
            if (otOffnetMins) {
              return otOffnetMins;
            } else {
              return "-";
            }
          }
        },
        "One Time Data": {
          field: "otData",
          callback: otData => {
            if (otData) {
              return otData;
            } else {
              return "-";
            }
          }
        },
        "One Time SMS": {
          field: "otSms",
          callback: otSms => {
            if (otSms) {
              return otSms;
            } else {
              return "-";
            }
          }
        },
        "Monthly Telenor Mins": {
          field: "mthlyOnnetMins",
          callback: mthlyOnnetMins => {
            if (mthlyOnnetMins) {
              return mthlyOnnetMins;
            } else {
              return "-";
            }
          }
        },
        "Monthly Other Mins": {
          field: "mthlyOffnetMins",
          callback: mthlyOffnetMins => {
            if (mthlyOffnetMins) {
              return mthlyOffnetMins;
            } else {
              return "-";
            }
          }
        },
        "Monthly Data": {
          field: "mthlyData",
          callback: mthlyData => {
            if (mthlyData) {
              return mthlyData;
            } else {
              return "-";
            }
          }
        },
        "Monthy SMS": {
          field: "mthlySms",
          callback: mthlySms => {
            if (mthlySms) {
              return mthlySms;
            } else {
              return "-";
            }
          }
        },
        "Bundle Telenor Mins": {
          field: "addOnOnnetMins",
          callback: addOnOnnetMins => {
            if (addOnOnnetMins) {
              return addOnOnnetMins;
            } else {
              return "-";
            }
          }
        },
        "Bundle Other Mins": {
          field: "addOnOffnetMins",
          callback: addOnOffnetMins => {
            if (addOnOffnetMins) {
              return addOnOffnetMins;
            } else {
              return "-";
            }
          }
        },
        "Bundle Data": {
          field: "addOnData",
          callback: addOnData => {
            if (addOnData) {
              return addOnData;
            } else {
              return "-";
            }
          }
        },
        "Bundle SMS": {
          field: "addOnSms",
          callback: addOnSms => {
            if (addOnSms) {
              return addOnSms;
            } else {
              return "-";
            }
          }
        },
        "Billing Cycle": {
          field: "billingCycle",
          callback: billingCycle => {
            if (billingCycle) {
              return billingCycle;
            } else {
              return "-";
            }
          }
        }
      },
      loading: false,
      items: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalPages: undefined,
        totalItems: undefined
      },
      errorMsg: "",
      headers: [
        {
          text: "Date",
          value: "date",
          sortable: false,
          align: 'center'
        },
        {
          text: "Parent Msisdn",
          value: "parentMsisdn",
          sortable: false,
          align: 'center'
        },
        {
          text: "Price Plan",
          value: "pricePlan",
          sortable: false,
          align: 'center'
        },
       /* {
          text: "Total Childs",
          value: "totalChildern",
          sortable: false,
          align: 'center'
        },*/
        {
          text: "Current Children",
          value: "currentChildern",
          sortable: false,
          align: 'center'
        },
        {
            text: "One Time Telenor Mins",
            value: "otOnnetMins",
            align: 'center',
            sortable: false
        },
        {
          text: "One Time Other Mins",
          value: "otOffnetMins",
          align: 'center',
          sortable: false
        },
        {
          text: "One Time Data",
          value: "otData",
          align: 'center',
          sortable: false
        },
        {
          text: "One Time SMS",
          value: "otSms",
          align: 'center',
          sortable: false
        },
        {
          text: "‏Monthly Telenor Mins",
          value: "mthlyOnnetMins",

          align: 'center',
          sortable: false
        },
        {
          text: "‏Monthly Other Mins",
          value: "mthlyOffnetMins",

          align: 'center',
          sortable: false
        },
        {
          text: "‏Monthly Data",
          value: "mthlyData",

          align: 'center',
          sortable: false
        },
        {
          text: "‏Monthly SMS",
          value: "mthlySms",

          align: 'center',
          sortable: false
        },
        {
          text: "Bundle Telenor Mins",
          value: "addOnOnnetMins",

          align: 'center',
          sortable: false
        },

        {
          text: "Bundle Other Mins",
          value: "addOnOffnetMins",

          align: 'center',
          sortable: false
        },
        {
          text: "Bundle Data",
          value: "addOnData",

          align: 'center',
          sortable: false
        },
        {
          text: "Bundle SMS",
          value: "addOnSms",

          align: 'center',
          sortable: false
        },
        {
          text: "Billing Cycle",
          value: "billingCycle",
          sortable: false,
          align: 'center'
        }
      ],
      consentReport: [],
      exportData: [],
      dateMenuFrom: false,
      dateMenuTo: false,
      parentMsisdn: "",
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD")
    };
  },
  watch: {
    pagination: function(news, olds) {
      this.navigateToSearch();
    },
    "$route.query": function() {
      this.getReport();
    }
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
          }
        })
        .catch(error => {
          this.$router.push("/");
          this.$router.push({
            name: "report.parentReport",
            query: {
              page: this.pagination.page,
              rowsPerPage: this.pagination.rowsPerPage,
              startDate: this.startDate,
              endDate: this.endDate,
              ...(this.parentMsisdn && { parentMsisdn: this.parentMsisdn })
            }
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
          parentMsisdn: this.parentMsisdn,
          
        };
        let query = utils.getQueryString(obj);
        await this.$http
          .get(
            window.ReportBaseURL +
              "/transaction/getParentResourceSharingReport" +
              query
          )
          .then(result => {
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
        this.pagination.rowsPerPage = obj.rowsPerPage ? obj.rowsPerPage : this.pagination.rowsPerPage;
        this.startDate = obj.startDate ? obj.startDate : moment().subtract(1, "months").format("YYYY-MM-DD");
        this.endDate = obj.endDate ? obj.endDate : moment().format("YYYY-MM-DD");
        this.parentMsisdn = obj.parentMsisdn;
      }
    },
    //format date
    formatDate(datetime) {
        let date = new Date(datetime).toJSON().slice(0,10);
        return date;
    },
  },
  computed: {
    tableData: function() {
      return this.consentReport.map(data => {
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
    }
  },
  mounted() {},
  beforeDestroy() {}
};
</script>
<style>
.rs-table table thead th,
.rs-table table tbody td {
  padding: 0 5px !important;
}
</style>