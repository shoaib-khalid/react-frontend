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
            <p href title="" class="animation">TODO</p>
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
            <!-- <download-excel
                          :escapeCsv=false
                          :fetch="fetchData"
                          :fields="json_fields"
                          type="csv"
                          name="ParentRenewalSummary.xls"
                        >Download Excel</download-excel> -->
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
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
