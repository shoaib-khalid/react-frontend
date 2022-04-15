(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["app~21833f8f"],{"1d0e":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[t.users?s("div",[s("h4",{staticClass:"mb-3"},[t._v("List of Users")]),s("v-card",[s("v-card-title",[s("router-link",{attrs:{small:"",fab:"",dark:"",color:"indigo",to:{name:"user.add"},"data-toggle":"tooltip",title:"Add New User"}},[s("v-btn",{attrs:{fab:"",dark:"",small:"",color:"#3498db"}},[s("v-icon",{attrs:{dark:""}},[t._v("add")])],1)],1),s("v-spacer"),s("v-text-field",{attrs:{"append-icon":"search",label:"Search","single-line":"","hide-details":""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),s("v-data-table",{attrs:{headers:t.headers,items:t.tableDataNew,search:t.search},scopedSlots:t._u([{key:"items",fn:function(e){return[s("td",{staticClass:"justify-center layout px-0"},[s("v-icon",{staticClass:"mr-2",attrs:{small:"","data-toggle":"tooltip",title:"Reset Password"},on:{click:function(s){return t.resetPassword(e.item.id)}}},[t._v("vpn_key")]),s("v-icon",{staticClass:"mr-2",attrs:{small:"","data-toggle":"tooltip",title:"Edit User"},on:{click:function(s){return t.edit(e.item.id)}}},[t._v("edit")]),s("v-icon",{attrs:{"data-toggle":"tooltip",title:"Delete User",small:""},on:{click:function(s){return t.del(e.item.id)}}},[t._v("delete")])],1),s("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.name))]),s("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.email))]),s("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.username))]),s("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.role))]),s("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.created))]),s("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.createdBy))])]}},{key:"no-results",fn:function(){return[s("v-alert",{attrs:{value:!0,color:"error",icon:"warning"}},[t._v('Your search for "'+t._s(t.search)+'" found no results.')])]},proxy:!0}],null,!1,3423897387)})],1)],1):t._e(),t.users?t._e():s("div",[s("div",{staticClass:"card",staticStyle:{width:"100%",height:"100%"}},[s("div",{staticClass:"card-block p-5"},[s("h3",[t._v(t._s(t.errorMsg))])])])])])},r=[],i=(s("c5f6"),s("3d20")),l=s.n(i),o=s("c1df"),n=s.n(o),d=s("2b0e"),c={data:function(){return{search:"",errorMsg:"",headers:[{text:"Actions",value:""},{text:"Name",value:"name"},{text:"Email",value:"email"},{text:"Username",value:"username"},{text:"Role",value:"role"},{text:"Created At",value:"created"},{text:"Created By",value:"createdBy"}],users:[]}},mounted:function(){this.getuserlist()},created:function(){},methods:{getuserlist:function(){var t=this,e={pageNumber:1,pageSize:Number.MAX_VALUE};d["default"].$http.post("/user/getUserList",e).then((function(e){"00"==e.errorCode?t.users=e.data:"53"==e.errorCode&&(t.users=void 0,t.errorMsg=e.errorMsg)}))},resetPassword:function(t){var e=this;l.a.fire({title:"Are you sure to reset?",type:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, reset it!"}).then((function(s){if(s.value){var a={id:t};e.$http.post("/user/resetUserPassword",a).then((function(t){"00"==t.errorCode?e.$store.commit("notis/setAlert",{type:"success",title:t.errorMsg,time:"4"}):e.$store.commit("notis/setAlert",{type:"error",title:t.errorMsg,time:"4"})}))}}))},edit:function(t){var e=t;this.$router.push({name:"user.edit",params:{id:e}})},del:function(t){var e=this;l.a.fire({title:"Are you sure?",text:"You won't be able to revert this!",type:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete it!"}).then((function(s){if(s.value){var a={id:t};d["default"].$http.post("user/deleteUser",a).then((function(s){"00"==s.errorCode?(e.$store.commit("notis/setAlert",{type:"success",title:s.errorMsg,time:"4"}),e.users=e.users.filter((function(e){return e.id!==t}))):e.$store.commit("notis/setAlert",{type:"error",title:s.errorMsg,time:"4"})}))}}))}},computed:{tableDataNew:function(){return this.users?this.users.map((function(t){return t.created=n()(t.created,"YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY"),t})):this.users}}},u=c,m=(s("7cfd"),s("2877")),v=s("6544"),f=s.n(v),p=s("0798"),h=s("8336"),b=s("b0af"),w=s("12b2"),g=s("8fea"),C=s("132d"),_=s("9910"),y=s("2677"),$=Object(m["a"])(u,a,r,!1,null,"a78464be",null);e["default"]=$.exports;f()($,{VAlert:p["a"],VBtn:h["a"],VCard:b["a"],VCardTitle:w["a"],VDataTable:g["a"],VIcon:C["a"],VSpacer:_["a"],VTextField:y["a"]})},"36a3":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"pl-5 pr-5 pt-2"},[s("router-view")],1)},r=[],i={data:function(){return{}}},l=i,o=s("2877"),n=Object(o["a"])(l,a,r,!1,null,null,null);e["default"]=n.exports},4657:function(t,e,s){"use strict";s("20d6");var a=s("2b0e"),r=s("2733");a["default"].directive("can-view",{isLiteral:!1,isEmpty:!1,twoWay:!0,inserted:function(t){},bind:function(t,e,s){e.modifiers.disable;if(e.value){var a=e.value.filter((function(t){return r["a"].getters.getPermissions.findIndex((function(e){return e===t}))>=0}));a.length>0?$(t).show():$(t).hide()}}})},"5ea9":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"card p-3"},[s("div",{staticClass:"card-block"},[s("h5",[t._v("Edit User")]),s("form",{on:{submit:function(e){return e.preventDefault(),t.handleSubmit.apply(null,arguments)}}},[s("div",{staticClass:"form-group row"},[t._m(0),s("div",{staticClass:"col-sm-10 pull-right"},[s("input",{directives:[{name:"validate",rawName:"v-validate",value:"required|email",expression:"'required|email'"},{name:"model",rawName:"v-model",value:t.user.email,expression:"user.email"}],staticClass:"form-control",class:{"is-invalid":t.submitted&&t.errors.has("email")},attrs:{type:"text",name:"email"},domProps:{value:t.user.email},on:{input:function(e){e.target.composing||t.$set(t.user,"email",e.target.value)}}}),t.submitted&&t.errors.has("email")?s("div",{staticClass:"invalid-feedback"},[t._v(t._s(t.errors.first("email")))]):t._e()])]),s("div",{staticClass:"form-group row"},[t._m(1),s("div",{staticClass:"col-sm-10 pull-right"},[s("input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"},{name:"model",rawName:"v-model",value:t.user.name,expression:"user.name"}],staticClass:"form-control",class:{"is-invalid":t.submitted&&t.errors.has("name")},attrs:{type:"text",name:"name"},domProps:{value:t.user.name},on:{input:function(e){e.target.composing||t.$set(t.user,"name",e.target.value)}}}),t.submitted&&t.errors.has("name")?s("div",{staticClass:"invalid-feedback"},[t._v(t._s(t.errors.first("name")))]):t._e()])]),s("hr"),s("div",{staticClass:"form-group row"},[s("div",{staticClass:"col-sm-5 col-sm-offset-2"},[s("button",{staticClass:"btn btn-primary",attrs:{disabled:t.loading}},[t._v("Update")])])])])])])])},r=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("label",{staticClass:"col-sm-2 col-form-label"},[t._v(" Email "),s("span",{staticClass:"text-danger"},[t._v("*")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("label",{staticClass:"col-sm-2 col-form-label"},[t._v(" Full Name "),s("span",{staticClass:"text-danger"},[t._v("*")])])}],i=(s("7f7f"),s("2b0e")),l={props:["id"],data:function(){return{user:{id:"",name:"",email:""},loading:!1,submitted:!1}},methods:{handleSubmit:function(t){var e=this;this.submitted=!0,this.$validator.validate().then((function(t){t?(e.loading=!0,e.submitted=!0,i["default"].$http.post("/user/updateUser",e.user).then((function(t){"00"==t.errorCode?(e.$store.commit("notis/setAlert",{type:"success",title:t.errorMsg,time:"4"}),e.$router.push({name:"user"})):e.$store.commit("notis/setAlert",{type:"error",title:t.errorMsg,time:"4"})}))):console.log(t)}))},loadUserInfo:function(){var t=this,e={id:this.$route.params.id};i["default"].$http.post("/user/getUserDetails",e).then((function(e){t.user.id=e.data.id,t.user.name=e.data.name,t.user.email=e.data.email}))}},mounted:function(){this.$route.params.id?this.loadUserInfo():this.$router.push({name:"user"})}},o=l,n=s("2877"),d=Object(n["a"])(o,a,r,!1,null,null,null);e["default"]=d.exports},"7cfd":function(t,e,s){"use strict";s("ab05")},"96ca":function(t,e,s){"use strict";s("0d6d");var a=Object.freeze({STORAGE_KEY:"fpusertype",PREPAID:"prepaid",POSTPAID:"postpaid"});e["a"]=a},"9aaa":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("v-layout",[s("v-flex",{attrs:{xs12:"",sm12:""}},[s("v-card",[s("v-card-actions",[s("v-btn",{attrs:{flat:"",color:"orange"},on:{click:t.changePassword}},[t._v("Change Password")])],1),s("v-card-title",{attrs:{"primary-title":""}},[s("div",{staticClass:"col-md-12"},[s("v-tabs",{attrs:{left:""}},[s("v-tab",[s("h3",[t._v("Account Info")])]),s("v-tab-item",{key:"tabMainProfileHistory"},[s("v-container",{attrs:{fluid:""}},[s("div",{staticClass:"col-md-12"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-md-2"},[s("label",{staticStyle:{"font-weight":"bold"}},[t._v("Name")])]),s("div",{staticClass:"col-md-8 col-6"},[t._v(t._s(t.$store.getters.getUser.name||"-"))])]),s("hr"),s("div",{staticClass:"row"},[s("div",{staticClass:"col-md-2"},[s("label",{staticStyle:{"font-weight":"bold"}},[t._v("Email")])]),s("div",{staticClass:"col-md-8 col-6"},[t._v(t._s(t.$store.getters.getUser.email||"-"))])]),s("hr"),s("div",{staticClass:"row"},[s("div",{staticClass:"col-md-2"},[s("label",{staticStyle:{"font-weight":"bold"}},[t._v("Username")])]),s("div",{staticClass:"col-md-8 col-6"},[t._v(t._s(t.$store.getters.getUser.username||"-"))])]),s("hr"),s("div",{staticClass:"row"},[s("div",{staticClass:"col-md-2"},[s("label",{staticStyle:{"font-weight":"bold"}},[t._v("Role")])]),s("div",{staticClass:"col-md-8 col-6"},[t._v(t._s(t.$store.getters.getRole||"-"))])]),s("hr")])])],1)],1)],1)])],1)],1)],1)],1)},r=[],i=(s("7514"),s("96cf"),s("3b8d")),l=s("3d20"),o=s.n(l),n={data:function(){return{}},computed:{},methods:{changePassword:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,s,a,r=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,o.a.fire({title:"Change Password",html:'<div class="popup-change-pass"><div class="pos-rela" style="position:relative"><label>Old Password</label><input id="swal-input1" v-validate="\'required\'" type="password" class="form-control"></div><div class="pos-rela" style="position:relative"><label>New Password</label><input id="swal-input2" v-validate="\'required\'" type="password" class="form-control"></div><div class="pos-rela" style="position:relative"><label>New Password Confirmation</label><input id="swal-input3" v-validate="\'required\'" type="password" class="form-control"></div></div>',focusConfirm:!1,preConfirm:function(){var t=document.getElementById("swal-input1"),e=document.getElementById("swal-input2"),s=document.getElementById("swal-input3");if($(document).find(".error-swal-input").hide(),t.value&&e.value&&s.value&&e.value==s.value)return[t.value,e.value,s.value];if(""==t.value){var a=$(document).find(".error-swal-input1");0==a.length&&(a=$("<p/>").addClass("error-swal-input").addClass("error-swal-input1"),$(t).after(a)),a.html("Old password can't be empty!").show()}if(""==e.value){var r=$(document).find(".error-swal-input2");0==r.length&&(r=$("<p/>").addClass("error-swal-input").addClass("error-swal-input2"),$(e).after(r)),r.html("New password can't be empty!").show()}if(""==s.value){var i=$(document).find(".error-swal-input3");0==i.length&&(i=$("<p/>").addClass("error-swal-input").addClass("error-swal-input3"),$(s).after(i)),i.html("New password confirmation can't be empty!").show()}if(s.value!=e.value){var l=$(document).find(".error-swal-input3");0==l.length&&(l=$("<p/>").addClass("error-swal-input").addClass("error-swal-input3"),$(s).after(l)),l.html("Password and confirm password don't match!").show()}return!1},inputValidator:function(t){console.log(t)}});case 2:e=t.sent,s=e.value,s&&(a={currentPassword:s[0],newPassword:s[2]},this.$http.post("/user/changeUserPassword",a).then((function(t){"00"==t.errorCode?r.$store.commit("notis/setAlert",{type:"success",title:t.errorMsg,time:"4"}):r.$store.commit("notis/setAlert",{type:"error",title:t.errorMsg,time:"4"})})));case 5:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()}},d=n,c=s("2877"),u=s("6544"),m=s.n(u),v=s("8336"),f=s("b0af"),p=s("99d9"),h=s("12b2"),b=s("a523"),w=s("0e8f"),g=s("a722"),C=s("71a3"),_=s("c671"),y=s("fe57"),x=Object(c["a"])(d,a,r,!1,null,null,null);e["default"]=x.exports;m()(x,{VBtn:v["a"],VCard:f["a"],VCardActions:p["a"],VCardTitle:h["a"],VContainer:b["a"],VFlex:w["a"],VLayout:g["a"],VTab:C["a"],VTabItem:_["a"],VTabs:y["a"]})},a73b:function(t,e,s){"use strict";s("0d6d");var a=Object.freeze({BASE_URL_KEY:"baseUrl",BASE_REPORT_URL_KEY:"baseReportUrl",BASE_PREPAID_URL_KEY:"basePrepaidUrl"});e["a"]=a},ab05:function(t,e,s){}}]);