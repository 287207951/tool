Component({
  properties: {
    defProp: Boolean,
    tit: String,
    confirm: String,
    cancel: String
  },

  data: {},

  methods: {
    formSubmit(e) {
      this.triggerEvent('defSerForm', e.detail.value)
    },

    formReset(e) {
      this.setData({
        defReMarkVal: '',
        defProp: true
      })
    }
  }
})

