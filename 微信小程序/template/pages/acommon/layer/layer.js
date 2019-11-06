Component({
  properties: {
    
  },

  data: {
    show: true
  },

  methods: {
    show() {
      this.setData({
        popuShow: false
      })
      this.triggerEvent('popuShow')
    },

    confirm() {
      this.triggerEvent('popConfirm')
    }
  }
})
