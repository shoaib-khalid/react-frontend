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
            <td name="Parent Number">{{ props.item.parentMsisdn }}</td>
            <td name="Child number">{{ props.item.memberMsisdn }}</td>
            <td name="Offer Name">{{ props.item.offerName }}</td>
            <td name="On Net Value Shared (Parent)"></td>
            <td name="Off Net Value Shared (Parent)"></td>
            <td name="Data Value Shared (Parent)"></td>
            <td name="SMS Value Shared (Parent)"></td>
            <td name="On Net Value Shared (Child)"></td>
            <td name="Off Net Value Shared (Child)"></td>
            <td name="Data Value Shared (Child)"></td>
            <td name="SMS Value Shared (Child)"></td>
            <!-- <td>{{ props.item.operationDate }}</td> -->
            <!-- <td>{{ props.item.operationType }}</td> -->
            <!-- <td>{{ props.item.sharedResource }}</td> -->
            <!-- <td>{{ props.item.sharedResourceValue }}</td> -->
            <td name="Resources Expiry Date">
              {{ props.item.sharedResourceExpiryDate }}
            </td>
            <td name="Response">{{ props.item.response }}</td>
            <td name="Reason of Response">{{ props.item.resonOfResponse }}</td>
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
import ApiUrls from "../../enums/ApiUrls";

export default {
  data() {
    return {
      basePrepaidUrl: "",
      tableData: [],
      headers: [
        {
          text: "Parent Number",
          value: "Parent Number",
          sortable: false,
        },
        {
          text: "Child Number",
          value: "Child Number",
          sortable: false,
        },
        {
          text: "Offer Name",
          value: "Offer Name",
          sortable: false,
        },
        {
          text: "On Net Value Shared (Parent)",
          value: "On Net Value Shared (Parent)",
          sortable: false,
        },
        {
          text: "Off Net Value Shared (Parent)",
          value: "Off Net Value Shared (Parent)",
          sortable: false,
        },
        {
          text: "Data Value Shared (Parent)",
          value: "Data Value Shared (Parent)",
          sortable: false,
        },
        {
          text: "SMS Value Shared (Parent)",
          value: "SMS Value Shared (Parent)",
          sortable: false,
        },
        {
          text: "On Net Value Shared (Child)",
          value: "On Net Value Shared (Child)",
          sortable: false,
        },
        {
          text: "Off Net Value Shared (Child)",
          value: "Off Net Value Shared (Child)",
          sortable: false,
        },
        {
          text: "Data Value Shared (Child)",
          value: "Data Value Shared (Child)",
          sortable: false,
        },
        {
          text: "SMS Value Shared (Child)",
          value: "SMS Value Shared (Child)",
          sortable: false,
        },
        {
          text: "Resources Expiry Date",
          value: "Resources Expiry Date",
          sortable: false,
        },
        {
          text: "Response",
          value: "Response",
          sortable: false,
        },
        {
          text: "Reason of Response",
          value: "Reason of Response",
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
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      errorMsg: null,
    };
  },
  methods: {
    getReport() {
      const query = {
        params: {
          operationStartDate: this.startDate,
          operationEndDate: this.endDate,
        },
      };
      this.$http
        .post(`${this.basePrepaidUrl}/reports/getResourceSharingReport`, query)
        .then((result) => {
          this.tableData = result;
        });
    },
  },
  mounted() {
    this.basePrepaidUrl = sessionStorage.getItem(ApiUrls.BASE_PREPAID_URL_KEY);
  },
};
</script>
