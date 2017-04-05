export default {
  roles: {
    admin: {
      handler: function () {
        // return this.$auth.isAuthenticated()
        return true
      },
      permissions: ['can_read', 'can_create', 'can_update', 'can_moderate', 'can_delete']
    },

    moderator: {
      handler: function () {
        return this.$auth.isAuthenticated()
      },
      permissions: ['can_moderate']
    },

    user: {
      handler: function () {
        return this.$auth.isAuthenticated()
      },
      permissions: ['can_read', 'can_create', 'can_update']
    },

    guest: {
      handler: function () {
        return !this.$auth.isAuthenticated()
      },
      permissions: ['can_read']
    }
  },

  permissions: {
    can_read: function () {
      return true
    },

    can_create: function () {
      return true
    },

    can_update: function () {
      return false
    },

    can_moderate: function () {
      return true
    },

    can_delete: function () {
      return true
    }
  }
}