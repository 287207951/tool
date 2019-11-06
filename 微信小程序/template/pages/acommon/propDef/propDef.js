Component({
  properties: {
    defProp: Boolean,
    tit: String,
    confirm: String,
    cancel: String
  },

  data: {},

  methods: {
    func() {

    },
    
    formSubmit(e) {
      this.triggerEvent('defSerForm', e.detail.value)
    },

    formReset(e) {
      this.triggerEvent('exModalTrue', e.detail.value)
    }

  }
})

