const app = getApp()
Component({
  properties: {
    selectList: {
      type: String,
    }
  },

  data: {
    show: false
  },

  ready() {
    let classList = []
    app.$api.produceCodeList().then(res => {
      res.data.forEach((item, index, arr) => {
        // if (item.tit === '一级品目') {
        //   classList[0] = item
        // }
        // if (item.tit === '类别') {
        //   classList[1] = item 
        // }
        // if (item.tit === '主题') {
        //   classList[2] = item 
        // }
        // if (item.tit === '系列') {
        //   classList[3] = item
        // }
        if(wx.getStorageSync('gold') !== 1) {
          if (item.tit === '材质') {
            classList[5] = item
          }
        }
        if (item.tit === '生产工艺') {
          classList[6] = item
        }
        if (item.tit === '车花') {
          classList[7] = item
        }
        // if (item.tit === '适用人群') {
        //   classList[8] = item
        // }
        if (item.tit === '外观形状') {
          classList[9] = item
        }
      })
      // classList.splice(4, 0, {
      //   tit: '克重(g)',
      //   items: [{
      //     code: '小于1',
      //     value: '小于1'
      //   }, {
      //     code: '1-10',
      //     value: '1-10'
      //   }, {
      //     code: '10-20',
      //     value: '10-20'
      //   }, {
      //     code: '20-30',
      //     value: '20-30'
      //   }, {
      //     code: '30-40',
      //     value: '30-40'
      //   }, {
      //     code: '40-50',
      //     value: '40-50'
      //   }, {
      //     code: '50-100',
      //     value: '50-100'
      //   }, { 
      //     code: '大于100',
      //     value: '大于100'
      //   }]
      // })
      this.setData({
        classList
      })
    })
  },

  methods: {
    show() {
      this.setData({
        show: true
      })
      
    },

    hide() {
      this.setData({
        show: false
      })
    },

    reset() {
      const { classList } = this.data
      classList.forEach(item => {
        item.items.forEach(it => {
          it.checked = false
        })
      })
      this.setData({
        classList
      })
    },

    goIndex() {
      let params = {
        one: [],
        type: [],
        series: [],
        weight: [],
        gold: [],
        process: [],
        effect: [],
        car: [],
        crow: [],
        exterior: [],
        theme: []
      }
      this.data.classList.forEach(item => {
        item.items.forEach(it => {
          if (it.checked) {
            switch (item.tit) {
              case '一级品目':
                params.one.push(it.code);
                break
              case '工艺级别':
                params.type.push(it.code);
                break
              case '主题':
                params.theme.push(it.code);
                break
              case '系列':
                params.series.push(it.code);
                break
              case '克重(g)':
                params.weight.push(it.code);
                break
              case '材质':
                params.gold.push(it.code);
                break
              case '生产工艺':
                params.process.push(it.code);
                break
              case '表面工艺':
                params.effect.push(it.code);
                break
              case '车花':
                params.car.push(it.code);
                break
              case '适用人群':
                params.crow.push(it.code);
                break
              case '外观形状':
                params.exterior.push(it.code);
                break
            }
          }
        })
      })
      this.hide()
      this.triggerEvent('params', params)
      // wx.navigateTo({
      //   url: `/pages/searchResult/searchResult?searchClass=${JSON.stringify(params)}`,
      // })

    },

    itemClick(e) {
      let data = e.currentTarget.dataset
      let item = this.data.classList[data.index].items
      if (item[data.ix].checked) {
        item[data.ix].checked = false
      } else {
        // item.forEach(item => {
        //   item.checked = false
        // })
        item[data.ix].checked = true
      }
      this.setData({
        classList: this.data.classList
      })
    },
  }
})
