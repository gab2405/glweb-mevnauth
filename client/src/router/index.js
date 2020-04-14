import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('../views/Forgot.vue')
  },
  {
    path: '/reset/:token',
    name: 'Reset',
    component: () => import('../views/Reset.vue')
  },
  {
    path: '/confirm/:id',
    name: 'Confirm',
    component: () => import('../views/Confirm.vue')
  },
  {
    path: '/confirm',
    name: 'ConfirmSingle',
    component: () => import('../views/ConfirmSingle.vue')
  },
  {
    path: '/confirmInvitation/:token',
    name: 'Join',
    component: () => import('../views/Join.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/admin',
    component: () => import('../views/Admin.vue'),
    beforeEnter: isAdmin,
    children: [
      {
        path: '',
        component: () => import('@/views/admin/AdminDashboard.vue'),
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
        props: true
      },
      {
        path: 'user/edit/:id',
        component: () => import('@/views/admin/UserEdit.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const { getSecret } = require('../globalFunctions')

async function isAdmin(to, from, next) {
  let user = await getSecret()
  if (user.userGroup == "Admin") {
    next();
  } else {
    return false;
  }
}

async function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    let user = await getSecret()
    if (user.emailConfirmed) {
      next();
    } else {
      next('/confirm')
    }
  } else {
    next('/login');
  }
}

export default router