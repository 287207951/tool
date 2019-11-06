Component({
  properties: {
    defProp: Boolean,
    tit: String,
    place: String,
    value: String
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
