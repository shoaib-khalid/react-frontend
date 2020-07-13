<template>
  <v-app>
    <!--        <v-alert :value="$store.state.notis.alert.status" class="alert-layout" transition="scale-transition" dismissible :type="$store.state.notis.alert.type">
            {{$store.state.notis.alert.message}}
    </v-alert>-->
    <v-toolbar v-if="$store.getters.getIsAuth" app style="background:#00bcd4">
      <v-toolbar-title class="headline text-uppercase position-relative" style="width:100%;">
        <a href="/">
          <img src="/assets/images/logo.png" />
        </a>
        <!-- commented by abdullah as side bar is not required to show-->
        <!-- <button class="btn-toggle-menu" v-on:click="toggleMenu">
                    <feather size="30" stroke="white" type="menu"></feather>
        </button>-->

        <v-spacer></v-spacer>

        <div class="right-box">
          <a href="/">
            <span style="position:relative;top:5px;">
              <v-icon x-large dark>home</v-icon>
            </span>
          </a>
          <span
            style="color:white; margin:10px; cursor: pointer;"
            class="small"
            @click="goReport"
            v-if="!$store.getters.getChangePasswordRequired && $store.getters.getRole!='CRO'"
          >
            Reports
            <span></span>
          </span>
          <span style="color:white; margin:10px;" class="small">
            Welcome
            <span>{{$store.getters.getUser.name}}</span>
          </span>
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn dark icon v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile @click="goProfile" v-if="!$store.getters.getChangePasswordRequired">
                <v-list-tile-title>
                  <feather size="16" stroke="black" type="user"></feather>
                  <span class="pl-2">Profile</span>
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                @click="goManageUser"
                v-if="!$store.getters.getChangePasswordRequired && $store.getters.getRole!='CRO' && $store.getters.getRole!='ADMIN'"
              >
                <v-list-tile-title>
                  <feather size="16" stroke="black" type="users"></feather>
                  <span class="pl-2">Manage User</span>
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logout">
                <v-list-tile-title>
                  <feather size="16" stroke="black" type="log-out"></feather>
                  <span class="pl-2">Logout</span>
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </v-toolbar-title>
    </v-toolbar>
    <v-content v-if="$store.getters.getIsAuth">
      <v-layout row wrap class="base-layout">
        <v-flex key="xs1" v-bind:class="{ open: isMenuShow }" class="left-menu">
          <!-- commented by abdullah as side menu is not required  -->
          <!-- <menu-component></menu-component> -->
        </v-flex>
        <v-flex
          key="xs2"
          v-bind:class="{ right_content_expend: !isMenuShow,right_content: isMenuShow }"
          class="right-content pl-2 pr-2 pb-4 pt-4"
        >
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-content>
    <v-content v-if="!$store.getters.getIsAuth">
      <router-view></router-view>
      <!-- <login-component></login-component> -->
    </v-content>
    <v-content class="bglayout-slide"></v-content>
    <v-content class="loading" v-if="$store.state.notis.loading">
      <svg
        width="80px"
        height="80px"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        class="imgSvg"
      >
        <g transform="translate(50,50)">
          <g transform="scale(0.7)">
            <g transform="translate(-50,-50)">
              <g transform="rotate(239.504 50 50)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="0.75s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <path
                  ng-attr-fill-opacity="1"
                  :ng-attr-fill="config.c1"
                  d="M50 50L50 0A50 50 0 0 1 100 50Z"
                  fill-opacity="0.8"
                  fill="#f05125"
                />
              </g>
              <g transform="rotate(359.628 50.0024 50.0024)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <path
                  ng-attr-fill-opacity="1"
                  :ng-attr-fill="config.c2"
                  d="M50 50L50 0A50 50 0 0 1 100 50Z"
                  transform="rotate(90 50 50)"
                  fill-opacity="0.8"
                  fill="#fdb813"
                />
              </g>
              <g transform="rotate(119.752 50 50)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <path
                  ng-attr-fill-opacity="1"
                  :ng-attr-fill="config.c3"
                  d="M50 50L50 0A50 50 0 0 1 100 50Z"
                  transform="rotate(180 50 50)"
                  fill-opacity="0.8"
                  fill="#7fbb42"
                />
              </g>
              <g transform="rotate(239.876 50 50)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  calcMode="linear"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="3s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <path
                  ng-attr-fill-opacity="1"
                  :ng-attr-fill="config.c4"
                  d="M50 50L50 0A50 50 0 0 1 100 50Z"
                  transform="rotate(270 50 50)"
                  fill-opacity="0.8"
                  fill="#32a0da"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </v-content>
  </v-app>
</template>
<style type="text/css" scoped>
.right-box {
  position: absolute;
  right: 0;
  top: 19px;
  bottom: 0;
}

.loading {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: radial-gradient(#1e4e48, #022535);
  z-index: 10;
}

.loading img {
  margin: 200px auto 0;
  display: inherit;
}

.loading .imgSvg {
  margin: 200px auto 0;
  display: inherit;
}

.base-layout {
  height: 100%;
}

.left-menu {
  width: 0px;
}

.left-menu.open {
  width: 270px;
}

.right_content {
  width: calc(100% - 270px);
}

.right_content_expend {
  /*  -webkit-transition: width 2s;  Safari 
  transition: width 2s;*/
  width: calc(100% - 0px);
}

button.btn-toggle-menu {
  position: absolute;
  left: 200px;
  top: 32px;
  /* line-height: 1; */
}

.alert-layout {
  position: fixed;
  z-index: 999999;
  left: 0;
  right: 0;
  max-width: 546px;
  padding: 7px 10px;
}
</style>
<script>
import loading_image from "../public/assets/pie-preloader-gif.svg";
import Vue from "vue";
export default {
  name: "App",
  components: {},
  computed: {
    getLoading: function() {
      return this.$store.state.notis.loading;
    }
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      loading_image: loading_image,
      isMenuShow: false,
      config: {
        c1: "red",
        c2: "red",
        c3: "red",
        c4: "red"
      }
    };
  },
  mounted() {},
  methods: {
    logout: function() {
      let userobj = JSON.parse(sessionStorage.getItem("user"));
      let token = sessionStorage.getItem("token");

      let obj = {
        username: userobj.username,
        token: token
      };
      Vue.$http.post("/user/logout", obj).then(result => {
        if (result.errorCode == "00") {
          this.$store.commit("logout");
          this.$router.push({ name: "login" });
        } else {
          this.$store.commit("notis/setAlert", {
            type: "error",
            title: result.errorMsg,
            time: "4"
          });
        }
      });
    },
    toggleMenu: function() {
      this.isMenuShow = !this.isMenuShow;
    },
    goProfile() {
      this.$router.push({ name: "userprofile" });
    },
    goManageUser() {
      this.$router.push({ name: "user" });
    },
    goReport() {
      this.$router.push({ name: "report" });
    }
  }
};
</script>
<style type="text/css">
.v-btn.info {
  background-color: #2dcee3 !important;
  border-color: #2dcee3 !important;
  color: #fff !important;
}
</style>
<style lang="scss">
@import "assets/css/main.css";
</style>