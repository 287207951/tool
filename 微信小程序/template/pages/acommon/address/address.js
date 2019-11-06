const app = getApp()

Component({
  properties: {
    popuStatus: Boolean,
    animationData: Object
  },

  data: {
    result: {},
    proStatus: true,
    cityStatus: false,
    areaStatus: false,
    province: '',
    city: '',
    area: '',
  },

  ready() {
    this.setData({
      province: app.$city
    })
    let self = this
    this.animation = wx.createAnimation()
    
    // 获取高度比例
    const proportionHeight = 153 / 603 
    

    // 获取
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        self.setData({
          scrollHeight: (res.windowHeight *( 1 - proportionHeight)) * 2
        })
      }
    })
  },

  methods: {
    popuConfirm() {
      if (!this.data.result.province) {
        wx.showToast({
          title: '请选择省份',
          icon: 'none'
        })
        return
      }
      if (!this.data.result.city) {
        wx.showToast({
          title: '请选择城市',
          icon: 'none'
        })
        return
      }
      if (!this.data.result.district) {
        wx.showToast({
          title: '请选择区域',
          icon: 'none'
        })
        return
      }
      this.hidden()
      this.triggerEvent('popConfirm', { params: this.data.result })
      this.setData({
        result: {},
        proStatus: true,
        cityStatus: false,
        areaStatus: false,
        province: app.$city,
        city: '',
        area: '',
        activeNum: 0
      })
    },

    proviclick(e) {
      let item = e.currentTarget.dataset.item
      this.data.result.province = item.name
      this.setData({
        city: item.city,
        proStatus: false,
        cityStatus: true,
        result: this.data.result
      })
    },

    cityclick(e) {
      let item = e.currentTarget.dataset.item
      this.data.result.city = item.name
      this.setData({
        area: item.area,
        proStatus: false,
        cityStatus: false,
        areaStatus: true,
        activeNum: 1,
        result: this.data.result
      })
    },

    areaclick(e) {
      let item = e.currentTarget.dataset.item
      this.data.result.district = item
      this.setData({
        activeNum: 2,
        result: this.data.result
      })
    },

    protitclick(e) {
      this.data.result.city = ''
      this.setData({
        proStatus: true,
        cityStatus: false,
        areaStatus: false,
        result: this.data.result
      })
    },

    citytitclick(e) {
      if (!this.data.result.province) {
        return
      }
      this.data.result.district = ''
      this.setData({
        proStatus: false,
        cityStatus: true,
        areaStatus: false,
        result: this.data.result
      })
    },

    hidden() {
      let self = this
      setTimeout(() => {
        self.animation.height(800).step()
        self.setData({
          animationData: self.animation.export(),
        })
      }, 0)
      setTimeout(() => {
        self.setData({
          popuStatus: true
        })
      }, 300)
    },


    hiddenSlide() {
      this.hidden()
    }

  }
})
