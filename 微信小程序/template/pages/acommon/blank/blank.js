Component({
  properties: {
    blankStatus: Boolean,
    blankTit: String,
    blankInfo: String
  },

  data: {

  },

  methods: {
    slideBlank(e) {
      this.setData({
        blankStatus: false
      })
    }
  }
})
