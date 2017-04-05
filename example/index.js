import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueAuthenticate from 'vue-authenticate'
import VueAuthorize from '../src/index.js'
import aclConfig from './acl-config.js'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueAuthenticate)
Vue.use(VueAuthorize, aclConfig)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { 
      path: '/',
      name: 'index',
      meta: {
        permissions: {
          roles: ['user'],
          redirectTo: { name: 'login' }
        }
      },
      component: {
        template: `
          <div class="index-page">
            <h1>Index page</h1>

            <hr />

            <div class="guest-only" v-is-authorized="{ roles: ['guest'] }">guest</div>
            <div class="user-can_create-only" v-is-authorized="{ roles: ['user'], permissions: ['can_create'] }">user:can_create</div>
            <div class="can_moderate-only" v-is-authorized="{ permissions: ['can_moderate'] }">*:can_moderate</div>
          </div>
        `
      } 
    },

    {
      path: '/profile',
      name: 'profile',
      meta: {
        permissions: {
          roles: ['user'],
          redirectTo: { name: 'login' }
        }
      },
      component: {
        template: `
          <div class="profile-page">
            <h1>Profile page</h1>

            <hr />

            <div class="user-only" v-is-authorized="{ roles: ['admin'] }">guest</div>
            <div class="user-can_create-only" v-is-authorized="{ roles: ['user'], permissions: ['can_create'] }">user:can_create</div>
          </div>
        `
      }
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        permissions: {
          roles: ['guest'],
          redirectTo: { name: 'index' }
        }
      },
      component: {
        template: `
          <div class="login-page">
            <h1>Login page</h1>

            <hr />

            <button @click="login()">Login me now!</button>
          </div>
        `,
        methods: {
          login() {
            this.$auth.setToken({
              token: 'TOKEN_1234567890'
            })
            this.$router.push({ name: 'index' })
          }
        }
      }
    },
    {
      path: '/logout',
      name: 'logout',
      meta: {
        permissions: {
          roles: ['user'],
          redirectTo: { name: 'login' }
        }
      },
      component: {
        template: `
          <div class="logout-page">
            <h1>Logout page</h1>
          </div>`,
        created: function () {
          this.$auth.logout().then(() => {
            this.$router.push({ name: 'login' })
          })
        }
      }
    }
  ]
})

router.beforeEach(function (to, from, next) {
  if (to.meta && to.meta.permissions) {
    let roles = to.meta.permissions.roles
    let permissions = to.meta.permissions.permissions

    router.app.$authorize.isAuthorized(roles, permissions).then(function () {
      next()
    }).catch(function () {
      next(to.meta.permissions.redirectTo || { name: 'login' })
    })
  } else {
    next()
  }
})

const app = new Vue({
  router
}).$mount('#app')