import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import LoginComponent from './components/LoginComponent'
import ChangePasswordComponent from './components/ChangePasswordComponent'

import FPSearchComponent from './components/FPSearchComponent'
import CreateFPUserComponent from './components/CreateFPUserComponent'
import ParentProfileComponent from './components/ParentProfileComponent'
import ChildViewComponent from './components/ChildViewComponent'

import DashboardReportComponent from './components/reports/DashboardReportComponent'
import DailyConsentComponent from './components/reports/DailyConsentComponent'
import ResourceSharingComponent from './components/reports/ResourceSharingComponent'
import SubscriptionComponent from './components/reports/SubscriptionComponent'
import HierarchyComponent from './components/reports/HierarchyComponent'
import RenewalComponent from './components/reports/RenewalComponent'
import TransactionComponent from './components/reports/TransactionComponent'
import UssdComponent from './components/reports/UssdComponent'
import AgentLoginComponent from './components/reports/AgentLoginComponent'
import ProfileAccessComponent from './components/reports/ProfileAccessComponent'
import ProfileChangesComponent from './components/reports/ProfileChangesComponent'
import AgentActivityComponent from './components/reports/AgentActivityComponent'

import ReportListComponent from './components/reports/ReportListComponent'
import DashboardUserComponent from './components/user/DashboardUserComponent'
import ListUserComponent from './components/user/ListUserComponent'
import EditUserComponent from './components/user/EditUserComponent'
import AddUserComponent from './components/user/AddUserComponent'
import UserProfileComponent from './components/user/UserProfileComponent'

import ParentReportComponent from './components/reports/ParentReportComponent'
import ParentRenewalSummaryComponent from './components/reports/ParentRenewalSummaryComponent'

const router = new VueRouter({
    base: __dirname,
    routes: [
        {
            path: '/fpsearch',
            name: 'fpSearch',
            component: FPSearchComponent,
            meta: { description: '', requiresAuth: true }
        },
        {
            path: '/createfpuser',
            name: 'createfpuser',
            component: CreateFPUserComponent,
            meta: { description: '', requiresAuth: true }
        },
        {
            path: '/parentprofile',
            name: 'parentProfile',
            component: ParentProfileComponent,
            meta: { description: '', requiresAuth: true }
        },
        {
            path: '/childprofile',
            name: 'childProfile',
            component: ChildViewComponent,
            meta: { description: '', requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginComponent,
        },
        {
            path: '/changepassword',
            name: 'changePassword',
            component: ChangePasswordComponent,
        },
        {
            path: '/',
            redirect: 'fpsearch'
        },
        {
            path: '/report',
            component: DashboardReportComponent,
            meta: { description: '', requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'report',
                    redirect: { name: 'report.list' },
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'list',
                    name: 'report.list',
                    component: ReportListComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'consent',
                    name: 'report.consent',
                    component: DailyConsentComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'resource',
                    name: 'report.resource',
                    component: ResourceSharingComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'subscription',
                    name: 'report.subscription',
                    component: SubscriptionComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'hierarchy',
                    name: 'report.hierarchy',
                    component: HierarchyComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'renewal',
                    name: 'report.renewal',
                    component: RenewalComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'transaction',
                    name: 'report.transaction',
                    component: TransactionComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'ussd',
                    name: 'report.ussd',
                    component: UssdComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'login',
                    name: 'report.login',
                    component: AgentLoginComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'profileaccess',
                    name: 'report.profileaccess',
                    component: ProfileAccessComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'profilechanges',
                    name: 'report.profilechanges',
                    component: ProfileChangesComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'agentctivity',
                    name: 'report.agentctivity',
                    component: AgentActivityComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'parentReport',
                    name: 'report.parentReport',
                    component: ParentReportComponent,
                    meta: { description: '', requiresAuth: true }
                },
                {
                    path: 'ParentRenewalSummary',
                    name: 'report.ParentRenewalSummary',
                    component: ParentRenewalSummaryComponent,
                    meta: { description: '', requiresAuth: true }
                }



            ]
        },
        {
            path: '/user',
            component: DashboardUserComponent,
            children: [{
                path: '',
                name: 'user',
                redirect: { name: 'user.list' },
                meta: { description: '', requiresAuth: true }
            },
            {
                path: 'list',
                name: 'user.list',
                component: ListUserComponent,
                meta: { description: '', requiresAuth: true }
            },
            {
                path: 'add',
                name: 'user.add',
                component: AddUserComponent,
                meta: { description: '', requiresAuth: true }
            },
            {
                path: 'profile',
                name: 'userprofile',
                component: UserProfileComponent,
                meta: { description: '', requiresAuth: true }
            },


            {
                path: 'edit/:id',
                name: 'user.edit',
                component: EditUserComponent,
                meta: { description: '', requiresAuth: true }
            }
            ]
        }
    ]
})


export default router;

// router.beforeResolve((to, from, next) => {
//     // If this isn't an initial page load.
//     if (to.name) {
//         // Start the route progress bar.
//         // console.log("start route");
//     }
//     next()
// })



router.beforeEach((to, from, next) => {
    const authToken = sessionStorage.getItem('token');
    const authStatus = sessionStorage.getItem('is_auth');
    const role = sessionStorage.getItem('role');
    const is_changepasswordrequired = sessionStorage.getItem('is_changepasswordrequired');
    if (to.meta.requiresAuth) {
        if (!authStatus || authToken == null) {
            next('/login');
        }
        else if (is_changepasswordrequired == "1") {
            next('/changepassword');
        }
        else if (to.name.substring(0, to.name.indexOf('.')) == 'report' && role == 'CRO') {
            next('/fpsearch');
        }
        else if (to.name.substring(0, to.name.indexOf('.')) == 'user' && (role == 'CRO' || role == 'ADMIN')) {
            next('/fpsearch');
        }

        else {
            next();
        }
    } else {
        // to.name == "account.password.reset" ||
        if (authStatus || to.name == "login") {
            if (to.name == "login" && authStatus) {
                next('/fpsearch');
            }
            // else if (to.name == "account.password.reset")
            //  {
            //     next('/dashboard');
            //  }
            else {
                next()
            }
        }
        else {
            next()
        }
    }
})

// router.afterEach((to, from) => {
//     // Complete the animation of the route progress bar.
//     // console.log("done route")
//     // Swal.hideLoading()
// })