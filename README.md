# vue-authorize

[![Join the chat at https://gitter.im/vuejs-auth/vue-authorize](https://badges.gitter.im/vue-authenticate/Lobby.svg)](https://gitter.im/vuejs-auth/vue-authorize?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**vue-authorize** is a simple authorization library for [Vue.js](https://vuejs.org/) and is an extension of [vue-authenticate](https://github.com/dgrubelic/vue-authenticate) library.

**DISCLAIMER**

For now, this package only supports ES6 import usage, but soon will have standalone ES5 build.


*DEMO app comming soon...*


## Instalation
```bash
npm install vue-authorize
```

## Usage
```javascript
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueAuthenticate from 'vue-authenticate'
import VueAuthorize from 'vue-authorize'

Vue.use(VueResource)
Vue.use(VueAuthenticate, {
  // Your authentication config
}

Vue.use(VueAuthorize, {
  roles: {
    user: {
      handler: function () {
        // You have $auth instance directly in your role or permission handlers
        return this.$auth.isAuthorized()
      },
      permissions: ['can_read', 'can_create', 'can_update', 'can_delete']
    },
    guest: {
      handler: function () {
        return !this.$auth.isAuthorized()
      },
      permissions: ['can_read']
    }
  },

  permissions: {
    // You can have simple logic for checking if current user has write rights
    can_read:   function () { return true },

    // ... or you can even perform AJAX request and return Promise instance
    can_create: function () { return Promise.resolve() },
    can_update: function () { return false },
    can_delete: function () { return Promise.reject() }
  }
})
```

For internal Vue component usage, you have access to `$authorize` service. To check if user has access to some resource, you can simply call `$authorize.isAuthorized(roles, permissions)` method.

```javascript
new Vue({
  data() {
    return {
      showCreateButton: false,
      showUpdateButton: false,
      showDeleteButton: false
    }
  },

  inserted () {
    /** 
     * This will resolve since user role (if we asume that use is authenticated)
     * has 'can_create' permission.
     */
    this.$authorize.isAuthorized(['user'], ['can_create']).then(() => {
      // User is allowed to add more resources
      this.showCreateButton = true
    }).catch(() => {
      // User is not allowed to add any more resources
      this.showCreateButton = false
    })

    /** 
     * This will reject since user role (if we asume that use is authenticated)
     * has 'can_update' permission, but that permission returns `false`.
     */
    this.$authorize.isAuthorized(['guest'], ['can_update']).then(() => {
      // User is allowed to add more resources
      this.showUpdateButton = true
    }).catch(() => {
      // User is not allowed to add any more resources
      this.showUpdateButton = false
    })

    /** 
     * This will reject since user role (if we asume that use is authenticated)
     * has 'can_delete' permission, but that permission returns `Promise.reject()`.
     */
    this.$authorize.isAuthorized(['guest'], ['can_delete']).then(() => {
      // User is allowed to add more resources
      this.showUpdateButton = true
    }).catch(() => {
      // User is not allowed to add any more resources
      this.showUpdateButton = false
    })

    /** 
     * This will reject since guest role (if we asume that use is authenticated)
     * does not have 'can_create' permission.
     */
    this.$authorize.isAuthorized(['guest'], ['can_create']).then(() => {
      // User is allowed to add more resources
      this.showCreateButton = true
    }).catch(() => {
      // User is not allowed to add any more resources
      this.showCreateButton = false
    })
  }
})
```

### $authorize.isAuthorized() use cases

```javascript
// Check if user with guest role has access to resources. 
this.$authorize.isAuthorized(['guest'])
```

```javascript
// Check if user with guest role has permission to access and read resources.
this.$authorize.isAuthorized(['guest'], ['can_read'])
```

```javascript
// Check if user with any role has permission to edit resources.
this.$authorize.isAuthorized(null, ['can_update'])
```

### vue-router

You can easily use this library with [vue-router]()

Route example:
```javascript
new VueRouter({
  routes: [
    {
      path: '/protected-route',
      meta: {
        permissions: {
          roles: ['user'],
          redirectTo: '/login'
        }
      }
    }
  ]
})
```

Once you have setup your route meta data, write simple route change handler to check if user has access to targeted route.

```javascript
router.beforeEach(function (to, from, next) {
  if (to.meta && to.meta.permissions) {
    let roles = to.meta.permissions.roles
    let permissions = to.meta.permissions.permissions

    router.app.$authorize.isAuthorized(roles, permissions).then(function () {
      next()
    }).catch(function () {
      next(to.meta.permissions.redirectTo || '/login')
    })
  } else {
    next()
  }
})
```


Also, you can use already built-in directive and component to show/hide elements in the template.

### Directive (WIP) - need help!
Directive only does show/hide of elements

```html
<div class="user-only" v-if-authorized="{ roles: ['users'] }"></div>
<div class="user-can_update-only" v-if-authorized="{ roles: ['users'], permissions: ['can_update'] }"></div>
<div class="user-can_update-only" v-if-authorized="{ permissions: ['can_update'] }"></div>
```

### Component
Component internaly removes elements from the DOM if user does not have access to them.

```html
<is-authorized :roles="['user']" :permissions="['can_update']">
  <!-- Elements to show if user can update resource -->
</is-authorized>
```


## License

The MIT License (MIT)

Copyright (c) 2017 Davor Grubelić

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
