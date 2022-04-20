export default {
  isNumber: function (evt, maxValue = undefined) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    var str = String.fromCharCode(charCode);

    var value = evt.target.value + str;
    if (value) {
      value = parseInt(value, 10);
    } else {
      value = str;
    }

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault();
    } else {
      if (maxValue && value > maxValue) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  },
  formatBytes: function (bytes, unit = "MB") {
    let kilobyte = 1024;
    let megabyte = kilobyte * 1024;
    let gigabyte = megabyte * 1024;
    let terabyte = gigabyte * 1024;
    let precision = 0;

    if (unit == "KB") {
      return (bytes / kilobyte).toFixed(precision);
    } else if (unit == "MB") {
      return (bytes / megabyte).toFixed(precision);
    } else if (unit == "GB") {
      return (bytes / gigabyte).toFixed(precision);
    } else if (unit == "TB") {
      return (bytes / terabyte).toFixed(precision);
    } else {
      return null;
    }
  },
  formatMBsToBytes: function (mbs) {
    let kilobyte = 1024;
    let megabyte = kilobyte * 1024;
    return mbs * megabyte;
  },
  convertSecondsToMins: function (seconds) {
    let precision = 0;
    return (seconds / 60).toFixed(precision);
  },
  getQueryString: function (obj) {
    let query = "";
    if (obj) {
      let keys = Object.keys(obj);
      let filteredKeys = keys.filter((m) => obj[m]);
      if (filteredKeys) {
        query =
          "?" +
          filteredKeys
            .map(
              (k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k])
            )
            .join("&");
      }
    }
    return query;
  },

  convertMinsToSeconds(mins) {
    let precision = 0;
    return (mins * 60).toFixed(precision);
  },

  getBaseUrl() {
    return (
      "http://" +
      process.env.VUE_APP_CORE_IP +
      ":" +
      process.env.VUE_APP_CORE_PORT
    );
  },

  getBaseReportUrl() {
    return (
      "http://" +
      process.env.VUE_APP_REPORT_CORE_IP +
      ":" +
      process.env.VUE_APP_REPORT_CORE_PORT
    );
  },

  getBasePrepaidUrl() {
    return (
      "http://" +
      process.env.VUE_APP_PREPAID_CORE_IP +
      ":" +
      process.env.VUE_APP_PREPAID_CORE_PORT
    );
  },
};
