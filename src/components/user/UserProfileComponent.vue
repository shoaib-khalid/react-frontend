<template>
  <div>
    <v-layout>
      <v-flex xs12 sm12>
        <v-card>
          <v-card-actions>
            <v-btn
              flat
              color="orange"
              @click="changePassword"
            >Change Password</v-btn>
          </v-card-actions>
          <v-card-title primary-title>
            <div class="col-md-12">
              <v-tabs left>
                <v-tab>
                  <h3>Account Info</h3>
                </v-tab>

                <v-tab-item :key="'tabMainProfileHistory'">
                  <v-container fluid>
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-2">
                          <label style="font-weight:bold;">Name</label>
                        </div>
                        <div class="col-md-8 col-6">{{$store.getters.getUser.name || '-'}}</div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-md-2">
                          <label style="font-weight:bold;">Email</label>
                        </div>
                        <div class="col-md-8 col-6">{{$store.getters.getUser.email || '-'}}</div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-md-2">
                          <label style="font-weight:bold;">Username</label>
                        </div>
                        <div class="col-md-8 col-6">{{$store.getters.getUser.username || '-'}}</div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-md-2">
                          <label style="font-weight:bold;">Role</label>
                        </div>
                        <div class="col-md-8 col-6">{{$store.getters.getRole || '-'}}</div>
                      </div>
                      <hr />
                    </div>
                  </v-container>
                </v-tab-item>
              </v-tabs>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import Swal from "sweetalert2";
export default {
  data: () => ({}),
  computed: {},
  methods: {
    changePassword: async function() {
      const { value: formValues } = await Swal.fire({
        title: "Change Password",
        html:
          `<div class="popup-change-pass">` +
          `<div class="pos-rela" style="position:relative">` +
          `<label>Old Password</label>` +
          `<input id="swal-input1" v-validate="'required'" type="password" class="form-control">` +
          `</div>` +
          `<div class="pos-rela" style="position:relative">` +
          // `<p class="error error-swal-input1"></p>` +
          `<label>New Password</label>` +
          `<input id="swal-input2" v-validate="'required'" type="password" class="form-control">` +
          `</div>` +
          `<div class="pos-rela" style="position:relative">` +
          `<label>New Password Confirmation</label>` +
          `<input id="swal-input3" v-validate="'required'" type="password" class="form-control">` +
          `</div>` +
          `</div>`,
        focusConfirm: false,
        preConfirm: () => {
          let input1 = document.getElementById("swal-input1");
          let input2 = document.getElementById("swal-input2");
          let input3 = document.getElementById("swal-input3");

          $(document)
            .find(".error-swal-input")
            .hide();

          if (
            input1.value &&
            input2.value &&
            input3.value &&
            input2.value == input3.value
          ) {
            return [input1.value, input2.value, input3.value];
          } else {
            let count = 0;

            if (input1.value == "") {
              let error1 = $(document).find(".error-swal-input1");
              if (error1.length == 0) {
                error1 = $("<p/>")
                  .addClass("error-swal-input")
                  .addClass("error-swal-input1");
                $(input1).after(error1);
              }

              count++;
              error1.html("Old password can't be empty!").show();
            } else {
            }

            if (input2.value == "") {
              let error2 = $(document).find(".error-swal-input2");
              if (error2.length == 0) {
                error2 = $("<p/>")
                  .addClass("error-swal-input")
                  .addClass("error-swal-input2");
                $(input2).after(error2);
              }

              count++;
              error2.html("New password can't be empty!").show();
            } else {
            }

            if (input3.value == "") {
              let error3 = $(document).find(".error-swal-input3");
              if (error3.length == 0) {
                error3 = $("<p/>")
                  .addClass("error-swal-input")
                  .addClass("error-swal-input3");
                $(input3).after(error3);
              }

              count++;
              error3.html("New password confirmation can't be empty!").show();
            } else {
            }

            if (input3.value != input2.value) {
              let error3 = $(document).find(".error-swal-input3");
              if (error3.length == 0) {
                error3 = $("<p/>")
                  .addClass("error-swal-input")
                  .addClass("error-swal-input3");
                $(input3).after(error3);
              }

              count++;
              error3.html("Password and confirm password don't match!").show();
            } else {
            }

            return false;
          }
        },
        inputValidator: value => {
          console.log(value);
          // return new Promise((resolve) => {
          //     if (value === 'oranges') {
          //         resolve()
          //     } else {
          //         resolve('You need to select oranges :)')
          //     }
          // })
        }
      });

      if (formValues) {
        let obj = {
          currentPassword: formValues[0],
          newPassword: formValues[2]
        };

        this.$http.post("/user/changeUserPassword", obj).then(result => {
          if (result.errorCode == "00") {
            this.$store.commit("notis/setAlert", {
              type: "success",
              title: result.errorMsg,
              time: "4"
            });
          } else {
            this.$store.commit("notis/setAlert", {
              type: "error",
              title: result.errorMsg,
              time: "4"
            });
          }
        });
      }
    }
  }
};
</script>
<style type="text/css">
</style>