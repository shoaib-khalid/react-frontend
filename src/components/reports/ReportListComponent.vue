<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-block">
          <div class="list-title">
            <h5>Postpaid Reports</h5>
          </div>
          <div class="table-responsive-xl list-table">
            <table class="table table-hover table-striped">
              <thead class="table-primary">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Report Name</th>
                </tr>
              </thead>
              <tbody>
                <tr class="table-row" @click="goToConsentReport()">
                  <th scope="row">1</th>
                  <td>Consent</td>
                </tr>
                <tr class="table-row" @click="goToResourceReport()">
                  <th scope="row">2</th>
                  <td>Resource Sharing</td>
                </tr>
                <tr class="table-row" @click="goToSubscriptionReport()">
                  <th scope="row">3</th>
                  <td>Daily Subscription</td>
                </tr>
                <tr class="table-row" @click="goToHierarchyReport()">
                  <th scope="row">4</th>
                  <td>Hierarchy & Subscription</td>
                </tr>
                <tr class="table-row" @click="goToRenewalReport()">
                  <th scope="row">5</th>
                  <td>Renewal</td>
                </tr>
                <tr class="table-row" @click="goToTransactionReport()">
                  <th scope="row">6</th>
                  <td>Transaction</td>
                </tr>
                <tr class="table-row" @click="goToUssdReport()">
                  <th scope="row">7</th>
                  <td>USSD</td>
                </tr>
                <tr class="table-row" @click="goToLoginReport()">
                  <th scope="row">8</th>
                  <td>Agent Login</td>
                </tr>
                <tr class="table-row" @click="goToProfileAccessReport()">
                  <th scope="row">9</th>
                  <td>Profile Access</td>
                </tr>
                <tr class="table-row" @click="goToProfileChangesReport()">
                  <th scope="row">10</th>
                  <td>Profile Changes</td>
                </tr>
                <tr class="table-row" @click="goToAgentActivityReport()">
                  <th scope="row">11</th>
                  <td>Agent Activity</td>
                </tr>
                <tr class="table-row" @click="goToParentReport()">
                  <th scope="row">12</th>
                  <td>Parent Report</td>
                </tr>
                <tr class="table-row" @click="goToParentRenewalSummary()">
                  <th scope="row">13</th>
                  <td>Parent Summary Report</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-block">
          <div class="list-title">
            <h5>Prepaid Reports</h5>
          </div>
          <div class="table-responsive-xl list-table">
            <table class="table table-hover table-striped">
              <thead class="table-primary">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Report Name</th>
                </tr>
              </thead>
              <tbody>
                <tr class="table-row" @click="goToPrepaidSubscriptionReport()">
                  <th scope="row">1</th>
                  <td>Daily Subscription</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidHierarchyReport()">
                  <th scope="row">2</th>
                  <td>Hierarchy & Subscription</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidResourceReport()">
                  <th scope="row">3</th>
                  <td>Resource Sharing</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidLoginReport()">
                  <th scope="row">4</th>
                  <td>Agent Login</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidProfileAccessReport()">
                  <th scope="row">5</th>
                  <td>Customer Profile Access Details</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidMsisdnWiseReport()">
                  <th scope="row">6</th>
                  <td>MSISDN-wise Report</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidGroupsEditReport()">
                  <th scope="row">7</th>
                  <td>Groups Edit Report</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidTransactionReport()">
                  <th scope="row">8</th>
                  <td>Transaction Report</td>
                </tr>
                <tr class="table-row" @click="goToPrepaidUssdReport()">
                  <th scope="row">9</th>
                  <td>USSD Report</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToConsentReport() {
      this.$router.push({ name: "report.consent" });
    },
    goToResourceReport() {
      this.$router.push({ name: "report.resource" });
    },
    goToSubscriptionReport() {
      this.$router.push({ name: "report.subscription" });
    },
    goToHierarchyReport() {
      this.$router.push({ name: "report.hierarchy" });
    },
    goToRenewalReport() {
      this.$router.push({ name: "report.renewal" });
    },
    goToTransactionReport() {
      this.$router.push({ name: "report.transaction" });
    },
    goToUssdReport() {
      this.$router.push({ name: "report.ussd" });
    },
    goToLoginReport() {
      this.$router.push({ name: "report.login" });
    },
    goToProfileAccessReport() {
      this.$router.push({ name: "report.profileaccess" });
    },
    goToProfileChangesReport() {
      this.$router.push({ name: "report.profilechanges" });
    },
    goToAgentActivityReport() {
      this.$router.push({ name: "report.agentctivity" });
    },
    goToParentReport() {
      this.$router.push({ name: "report.parentReport" });
    },
    goToParentRenewalSummary() {
      this.$router.push({ name: "report.ParentRenewalSummary" });
    },
    goToPrepaidSubscriptionReport() {
      this.$router.push({ name: "report.prepaidSubscription" });
    },
    goToPrepaidHierarchyReport() {
      this.$router.push({ name: "report.prepaidHierarchy" });
    },
    goToPrepaidResourceReport() {
      this.$router.push({ name: "report.prepaidResourceSharing" });
    },
    goToPrepaidLoginReport() {
      this.$router.push({ name: "report.prepaidLogin" });
    },
    goToPrepaidProfileAccessReport() {
      this.$router.push({ name: "report.prepaidProfileAccess" });
    },
    goToPrepaidMsisdnWiseReport() {
      this.$router.push({ name: "report.prepaidMsisdn" });
    },
    goToPrepaidGroupsEditReport() {
      this.$router.push({ name: "report.prepaidGroupsEdit" });
    },
    goToPrepaidTransactionReport() {
      this.$router.push({ name: "report.prepaidTransaction" });
    },
    goToPrepaidUssdReport() {
      this.$router.push({ name: "report.prepaidUssd" });
    },
  },
};
</script>
<style>
.table-row {
  cursor: pointer;
}

.list-title {
  text-align: center;
  margin: 1em;
}
</style>