<template>
  <div class="card col-md-4 p-3">
    <div class="card-block text-xs-center">
      <h5>Select FP Type</h5>
      <v-layout row wrap align-center>
          <v-flex xs12 px-4 py-2>
              <v-btn type="submit" round :disabled="loading" color="#3498db" dark @click="chooseFPUserType(fpUserTypes.POSTPAID)">Postpaid FP</v-btn>
              <v-btn type="submit" round :disabled="loading" color="#3498db" dark @click="chooseFPUserType(fpUserTypes.PREPAID)">Prepaid FP</v-btn>
          </v-flex>
      </v-layout>        
    </div>
  </div>
</template>

<script>
import FPUserTypes from "../enums/FPUserTypes";

export default {
    data() {
        return {
            loading: false,
            fpUserTypes: FPUserTypes
        };
    },
    computed: {

    },
    watch: {

    },
    mounted() {
      sessionStorage.removeItem(this.fpUserTypes.STORAGE_KEY);
    },
    created() {

    },
    methods: {
      chooseFPUserType(fpUserType) {
        sessionStorage.setItem(this.fpUserTypes.STORAGE_KEY, fpUserType);
        this.$router.push({ name: "fpSearch" });
      }
    }
}
</script>

<style scoped>
.card {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
}
</style>