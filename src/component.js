export default {
  template: `
    <div v-if="isVisible" class="is-authorized-component">
      <slot></slot>
    </div>
  `,

  props: ['roles', 'permissions'],

  data() {
    return {
      isVisible: false
    }
  },

  created () {
    this.authorize()
  },

  updated () {
    this.authorize()
  },

  methods: {
    authorize() {
      this.$authorize.isAuthorized(this.roles, this.permissions).then(() => {
        this.isVisible = true
      }).catch(() => {
        this.isVisible = false
      })
    }
  }
}
