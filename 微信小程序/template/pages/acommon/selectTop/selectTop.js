Component({
  properties: {
    list: Array
  },

  data: {
    imgSlide: {
      a: '/images/order/icon-down.png',
      b: '/images/order/icon-up.png'
    },
    sortImgSlide: {
      a: '/images/index/icon-selectup.png',
      b: '/images/index/icon-selectdown.png'
    },
    // list: [
    //   { text: `品类`, val: 'pinmu', childrens: [{ text: `全部`, val: ` ` },{ text: `戒指`, val: `JZ` }, { text: `戒指`, val: `JZ` }], check: false, hasTrue: false },
    //   { text: `二级系列`, val: 'erji', childrens: [{ text: `全部`, val: ` ` },{ text: `初夏系列`, val: `CX` }, { text: `凌冬系列`, val: `MD` }], check: false },
    //   { text: `排序`, val: 'sort', childrens: [{ text: `综合排序`, val: `JZ`, sort: { statu: true } }, { text: `销量排序`, val: `JZ`, sort: { statu: true } }], check: false },
    // ],
    infoList: { check: false },
    infoIndex: 0
  },

  methods: {

    // 点击菜单
    changeTit(e) {
      const { item, index } = e.currentTarget.dataset
      let { list, infoList } = this.data

      const checkFocus = JSON.parse(JSON.stringify(list[index].check))

      list.forEach(item => {
        item.check = false
      })

      list[index].check = !checkFocus

      if (list[index].check) {
        infoList = list[index]
      } else {
        infoList = {}
      }

      this.setData({
        list,
        infoList,
        infoIndex: index
      })
    },

    // 选项改变时获取数据
    selectTrue(e) {
      const { item, index } = e.currentTarget.dataset
      let { list, infoList, infoIndex } = this.data
      let trueSelectAll = [], trueSelectIndexAll = []
      infoList.childrens.forEach(item => {
        item.check = false
      })

      list[infoIndex].childrens[index].check = true

      // 确定有多少个选项被选中
      list.forEach((item, index) => {
        item.hasTrue = false
        item.childrens.forEach(it => {
          if (it.check && it.val !== ' ') {
            trueSelectAll.push({text: item.val, val: it })
            trueSelectIndexAll.push(index)
            if (it.sort) {
              it.sort.statu = !it.sort.statu
            }
          }
        })
      })
      
      // 确定选项类别是否有被选择
      list.forEach((item, index) => {
        item.check = false
        trueSelectIndexAll.forEach((it, ix) => {
          if (index === it) {
            item.hasTrue = true
          }
        })
      })
      
      console.log(infoList)

      this.setData({
        list,
        infoList
      })

      console.log(trueSelectAll)
      this.triggerEvent('onChange', trueSelectAll)
    }

  }
})

