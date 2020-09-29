<template>
  <div>
    <div v-if="users">
      <h4 class="mb-3">List of Users</h4>
      <v-card>
        <!-- v-can-view="['user-add']" -->
        <v-card-title>
          <router-link
            small
            fab
            dark
            color="indigo"
            :to="{ name: 'user.add'}"
            data-toggle="tooltip"
            title="Add New User"
          >
            <v-btn fab dark small color="#3498db">
              <v-icon dark>add</v-icon>
            </v-btn>
          </router-link>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="tableDataNew" :search="search">
          <template v-slot:items="props">
            <td class="justify-center layout px-0">
              <!-- v-can-view="['user-reset-password']" -->
              <v-icon
                small
                class="mr-2"
                @click="resetPassword(props.item.id)"
                data-toggle="tooltip"
                title="Reset Password"
              >vpn_key</v-icon>
              <!-- v-can-view="['user-edit']" -->
              <v-icon
                small
                class="mr-2"
                @click="edit(props.item.id)"
                data-toggle="tooltip"
                title="Edit User"
              >edit</v-icon>
              <!-- v-can-view="['user-delete']" -->
              <v-icon
                data-toggle="tooltip"
                title="Delete User"
                small
                @click="del(props.item.id)"
              >delete</v-icon>
            </td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.username }}</td>
            <td class="text-xs-left">{{ props.item.role }}</td>
            <td class="text-xs-left">{{ props.item.created }}</td>
            <td class="text-xs-left">{{ props.item.createdBy }}</td>
          </template>
          <template v-slot:no-results>
            <v-alert
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <div v-if="!users">
      <div style="width:100%; height:100%" class="card">
        <div class="card-block p-5">
          <h3>{{errorMsg}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
.VueTables.VueTables--client {
  width: 100%;
}

.lalalala .VueTables__search-field {
  float: right !important;
}
</style>
<script>
import Swal from "sweetalert2";
import moment from "moment";
import Vue from "vue";
export default {
  data: () => ({
    search: "",
    errorMsg: "",
    headers: [
      { text: "Actions", value: "" },
      { text: "Name", value: "name" },
      { text: "Email", value: "email" },
      { text: "Username", value: "username" },
      { text: "Role", value: "role" },
      { text: "Created At", value: "created" },
      { text: "Created By", value: "createdBy" }
    ],
    users: []
  }),
  mounted() {
    this.getuserlist();
  },
  created() {},
  methods: {
    getuserlist() {
      let obj = {
        pageNumber: 1,
        pageSize: Number.MAX_VALUE
      };
      Vue.$http.post("/user/getUserList", obj).then(result => {
        if (result.errorCode == "00") {
          this.users = result.data;
        } else if (result.errorCode == "53") {
          this.users = undefined;
          this.errorMsg = result.errorMsg;
        }
      });
    },
    resetPassword(id) {
      Swal.fire({
        title: "Are you sure to reset?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reset it!"
      }).then(result => {
        if (result.value) {
          
          let obj = {
            id: id
          };
          this.$http.post("/user/resetUserPassword", obj).then(result => {
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
      });
    },
    edit(value) {
      var id = value;
      this.$router.push({ name: "user.edit", params: { id: id } });
    },
    del(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        
        if (result.value) {
          let obj = {
            id: id
          };
          Vue.$http.post("user/deleteUser", obj).then(result => {
            if (result.errorCode == "00") {
              this.$store.commit("notis/setAlert", {
                type: "success",
                title: result.errorMsg,
                time: "4"
              });
              this.users = this.users.filter(function(row) {
                return row.id !== id;
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
      });
    }
  },
  computed: {
    tableDataNew: function() {
      if (!this.users) {
        return this.users;
      } else {
        return this.users.map(data => {
          data.created = moment(data.created, "YYYY-MM-DD HH:mm:ss").format(
            "DD/MM/YYYY"
          );
          return data;
        });
      }
    }
  }
};
</script>