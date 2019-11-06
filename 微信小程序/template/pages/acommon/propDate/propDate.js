const app = getApp()

Component({
  properties: {
    defProp: Boolean,
    tit: String,
    confirm: String,
  },

  data: {
    startDate: `- - -`,
    endDate: `- - -`, 
  },

  methods: {
    startDateEv(e) {
      this.setData({
        startDate: e.detail.value
      })
    },

    endDateEv(e) {
      this.setData({
        endDate: e.detail.value
      })
    },

    formSubmit(e) {
      let params = { 
        startDate: this.data.startDate, 
        endDate: this.data.endDate 
      }
      if (this.data.startDate === '- - -') {
        app.$u.showToast('请选择来款日期')
        return
      }
      if (this.data.endDate === '- - -') {
        app.$u.showToast('请选择到货日期')
        return
      }
      this.triggerEvent('defSerForm', params)
    },

    formReset(e) {
      this.setData({
        defProp: false
      })
    }
  }
})
