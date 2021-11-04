<template>
  <div>
    <!-- Basic Form Inputs card start -->
    <div class="card col-md-4 p-3">
      <div class="card-block">
        <div v-if="!createNewFF && !requestPending">
          <h5>Choose User Type</h5>
            <v-layout row wrap>
              <v-flex xs12 px-4 py-5 class="text-center">
                <!-- class="text-right" -->
                <v-btn @click="goToFPSearch" round :disabled="loading" color="#3498db" dark>Prepaid</v-btn>
                <v-btn @click="goToFPSearch" round :disabled="loading" color="#3498db" dark>Postpaid</v-btn>
              </v-flex>
            </v-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import Vue from "vue";
import utils from "../utils";
export default {
  data: () => ({
    fpSearch: {
      userMsisdn: ""
    },
    loading: false,
    submitted: false,
    createNewFF: false,
    requestPending: false
  }),
  methods: {
    goToFPSearch() {
      this.$router.push({ name: 'fpSearch' });
    }
  },
};
</script>
<style scoped>
.card {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
}
</style>