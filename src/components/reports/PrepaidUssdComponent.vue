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
            <p href title="Daily Subscription" class="animation">USSD</p>
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
          <v-btn round color="#3498db" @click="getReport" dark>Search</v-btn>
        </div>
      </div>

      <!-- Download Excel Button -->
      <!-- <div class="row pb-2">
        <div class="col-md-2">
          <v-btn round color="#3498db" dark>
            <download-excel
                          :escapeCsv=false
                          :fetch="fetchData"
                          :fields="json_fields"
                          type="csv"
                          name="ParentRenewalSummary.xls"
                        >Download Excel</download-excel>
          </v-btn>
        </div>
      </div> -->

      <div class="rs-table">
        <v-data-table
          :headers="headers"
          :items="tableData"
          :pagination.sync="pagination"
          :total-items="pagination.totalItems"
          :rows-per-page-items="[10]"
        >
          <template v-slot:items="props">
            <td name="Parent Number">{{ props.item.parent }}</td>
            <td name="USSD">{{ props.item.userInput }}</td>
            <td name="Action Performed">{{ props.item.operationPerformed }}</td>
            <td name="Status">{{ props.item.operationStatus }}</td>
            <td name="Date &amp; Time">{{ props.item.operationTime }}</td>
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
      basePrepaidUrl: utils.getBasePrepaidUrl(),
      tableData: [],
      headers: [
        {
          text: "Parent Number",
          value: "Parent Number",
          sortable: false,
        },
        {
          text: "USSD",
          value: "USSD",
          sortable: false,
        },
        {
          text: "Action Performed",
          value: "Action Performed",
          sortable: false,
        },
        {
          text: "Status",
          value: "Status",
          sortable: false,
        },
        {
          text: "Date & Time",
          value: "Date & Time",
          sortable: false,
        },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalPages: undefined,
        totalItems: undefined,
      },
      dateMenuFrom: false,
      dateMenuTo: false,
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      errorMsg: null,
    };
  },
  methods: {
    getReport() {
      const queryObj = {
        operationStartDate: this.startDate,
        operationEndDate: this.endDate,
      };
      const queryParams = utils.getQueryString(queryObj);

      Vue.$http
        .post(this.basePrepaidUrl + "/reports/getUssdReport" + queryParams)
        .then((result) => {
          this.reportData = result.map((record) => {
            const date = new Date(record.operationDate);
            record.operationDate = date.toLocaleDateString("en-GB");
            record.channel = record.channel ? record.channel : "";
            return record;
          });
        });
    },
  },
};
</script>
