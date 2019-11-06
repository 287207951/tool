class util {
  constructor() {}

  // 对象数组去重
  unique(arr) {
    let unique = {};
    arr.forEach((item) => {
      unique[JSON.stringify(item)] = item;
    })
    arr = Object.keys(unique).map(function(u) {
      return JSON.parse(u);
    })
    return arr;
  }  

  // 对象数组去重 根据name
  repetName(arr) {
    let unique = {}
    var hash = {};
    return arr.reduce((item, next) => {
      hash[next.name] ? '' : hash[next.name] = true && item.push(next);
      return item
    }, [])
  }

  min(arr) {
    let min = arr[0];
    let len = arr.length;
    for (let i = 1; i < len; i++) {
      if (arr[i] < min) {
        min = i;
      }
    }
    return min;
  }

  max(arr) {
    let max = arr[0];
    let len = arr.length;
    for (let i = 1; i < len; i++) {
      if (arr[i] > max) {
        max = i;
      }
    }
    return max;
  }

  // 数组对象排序
  compareArr(property) {
    return (obj1, obj2) => {
      var value1 = obj1[property];
      var value2 = obj2[property];
      return value2 - value1;
    }
  }

  // map转换对象
  strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }

  // 对象转换map
  objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }

  china(str) {
    if (/.*[\u4e00-\u9fa5]+.*/.test(str)) {
      return true
    } else {
      return false
    }
  }

  // arr2 属于 arr1
  compare(arr1, arr2) {
    if (Object.prototype.toString.call(arr1) !== '[object Array]') {
      return
    }
    if (Object.prototype.toString.call(arr2) !== '[object Array]') {
      return
    }
    let flag = true
    for (let i = 0; i < arr2.length; i++) {
      if (!arr1.includes(arr2[i])) {
        flag = false
        break
      }
    }
    return flag
  }

  showModal(cont) {
    return new Promise((reslove, reject) => {
      wx.showModal({
        title: '提示',
        content: cont,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#333',
        confirmText: '确定',
        confirmColor: '#a71c20',
        success(res) {
          if (res.confirm) {
            reslove(res)
          } else if (res.cancel) {
            reject(res)
          }
        },
      })
    })
  }

  showToast(cont) {
    return new Promise((reslove, reject) => {
      wx.showToast({
        title: cont,
        icon: 'none',
        mask: true,
        success(res) {
          reslove(res)
        }
      })
    })
  }

  showLoading() {
    return new Promise((reslove, reject) => {
      wx.showLoading({
        title: '',
        mask: true,
        success(res) {
          reslove(res)
        },
      })
    })
  }

  // qs简化版
  fomartParams(obj) {
    let newKeys = Object.keys(obj).sort()
    let newObj = {}
    for (let i = 0; i < newKeys.length; i++) {
      newObj[newKeys[i]] = obj[newKeys[i]]
    }
    let result = ''
    for (let it in newObj) {
      if (Object.prototype.toString.call(newObj[it]) === '[object Array]') {
        newObj[it].forEach(val => {
          result += it + '=' + val + '&'
        });
      } else {
        result += it + '=' + newObj[it] + '&';
      }
    }
    result = result.substring(0, result.length - 1)
    return result;
  }

  // 改变规格
  changeItemSpec(options) {
    if (typeof options !== 'string') {
      return
    }
    options = options.replace(/、undefined+/, '')
    options = options.replace(/、$/, '')
    if (/、$/.test(options)) {
      options = this.changeItemSpec(options)
    }
    return options
  }

  // 计算价格
  countPrice(condit, feeType, totalSum, additionPrice = 0, feePrice = 0, weight = 0) {
    if (!condit) {
      console.log(`缺少成色`)
    }
    if (!feeType) {
      console.log(`缺少工费类型`)
    }
    if (!totalSum) {
      console.log(`缺少总数`)
    }
    let allPrice = 0
    let conditPrice = parseInt(condit) === 999 ? wx.getStorageSync('price999') : wx.getStorageSync('price9999')
    if (feeType === 1) {
      allPrice = (conditPrice + additionPrice) * weight * totalSum
    }
    if (feeType === 2) {
      allPrice = (conditPrice * weight + feePrice) * totalSum
    }
    return allPrice
  }

  // 套装计算价格
  countSuitPrice(condit, feeType = 2, totalSum, additionPrice = 0, feePrice = 0, weight = 0) {
    let allPrice = 0
    let conditPrice = parseInt(condit) === 999 ? wx.getStorageSync('price999') : wx.getStorageSync('price9999')
    if (feeType === 1) {
      allPrice = (conditPrice + additionPrice) * weight * totalSum
    }
    if (feeType === 2) {
      allPrice = (conditPrice * weight + feePrice) * totalSum
    }
    return allPrice
  }

  // 模拟switch
  switchs(options, obj, def) {
    let flag = true
    flag = Object.keys(obj).some(item => item === options + '')
    if (!flag) {
      return def
    }
    return obj[options]
  }


  //属性显示 内径/链长/手寸、克重、成色、材质、生产工艺、表面工艺、车花、开口类型/链扣类型
  getAttributesTwo(item) {
    const {
      one = '',
      goldCode = '',
      effectCode = '',
      carCode = '',
      openType = '',
      processCode = '',
      buckleCode = ''
    } = item.proBasics
    const {
      conditi = '',
      weight = '',
      extendAttr = '',
    } = item.proSpecData
    let arr = []
    let attribTxt = this.getAttachPropertyTwo(one, extendAttr) ? this.getAttachPropertyTwo(one, extendAttr) : null
    let weightTxt = weight + 'g'
    let openTypeBuckleCode = buckleCode
    if (openType === 1) {
      openTypeBuckleCode = `固口`
    }
    if (openType === 2) {
      openTypeBuckleCode = `开口`
    }
    Object.values({
      attribTxt,  // 内径/链长/手寸
      weightTxt,  // 克重
      conditi, // 成色
      goldCode,  // 材质
      processCode, // 生产工艺
      effectCode, // 表面工艺
      carCode, // 车花
      openTypeBuckleCode, // 开口类型/链扣类型
    }).map(v => v && v !== '' && arr.push(v))

    // 开口类型
    switch (item.one) {
      case '手镯':
        item.openType === 2 && arr.push('开口')
        item.openType === 1 && arr.push('固口')
        break
      case '戒指':
        item.openType === 2 && arr.push('开口')
        item.openType === 1 && arr.push('固口')
        break
    }
    return arr.join('、')
  }

  // 获取附加属性
  getAttachPropertyTwo(type, attr) {
    let {
      length,
      diameterLength,
      ringHand
    } =
      typeof attr === 'string' ? JSON.parse(attr) : attr
    switch (type) {
      case '手镯':
        return diameterLength ? diameterLength + 'cm' : ''
      case '戒指':
        return ringHand ? ringHand + '#' : ''
      case '手链':
        return length ? length + 'cm' : ''
      case '项链':
        return length ? length + 'cm' : ''
    }
  }

  // 属性显示 内径/链长/手寸、克重、成色、材质、生产工艺、表面工艺、车花、开口类型/链扣类型
  // 获取套装属性
  getSuitProperty(newVal) {
    newVal.codeList = [];
    let attribTxt = this.getAttachPropertyTwo(newVal.one, newVal.extend) ? this.getAttachPropertyTwo(one, extend) : null
    if (newVal.attribTxt) {
      // 内径/链长/手寸
      newVal.codeList.push(newVal.attribTxt);
    }
    if (newVal.weight) {
      // 克重
      newVal.codeList.push(`${newVal.weight}g`);
    }
    if (newVal.condit) {
      // 成色
      newVal.codeList.push(newVal.condit);
    }
    if (newVal.goldCode) {
      // 材质
      newVal.codeList.push(newVal.goldCode);
    }
    if (newVal.processCode) {
      // 生产工艺
      newVal.codeList.push(newVal.processCode);
    } 
    if (newVal.effect) {
      // 表面工艺
      newVal.codeList.push(newVal.effect);
    }
    if (newVal.carCode) {
      // 车花
      newVal.codeList.push(newVal.carCode);
    }
    if(newVal.buckleCode || newVal.openType) {
      let openTypeBuckleCode = newVal.buckleCode
      if (newVal.openType === 1) {
        openTypeBuckleCode = `固口`
      }
      if (newVal.openType === 2) {
        openTypeBuckleCode = `开口`
      }
      newVal.codeList.push(openTypeBuckleCode);
    }
    newVal.codeTxt = newVal.codeList.join("，");
    return newVal
  }

  // 套装名称 1.对戒 2.套装
  suitName(options) {
    let obj = {
      1: `对戒`,
      2: `套装`
    }
    return obj[options]
  }

  // 替换997为足金
  // replace997(options) {
  //   if(options !== `997`) {
  //     return options
  //   }
  //   return `足金`
  // }

  // 遍历所有属性 是否存在某个值
  loopObj(searkey, obj) {
    let bool = false
    let loop = (searkey, obj) => {
      for (let key in obj) {
        if (String(obj[key]).trim().indexOf(searkey) !== -1) {
          bool = true
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          loop(searkey, obj[key])
        }
      }
    }
    loop(searkey, obj)
    return bool
  }

  // 遍历所有属性 修改某个值
  loopObjReplace(oldVal, newVal,  obj) {
    let loop = (oldVal, obj) => {
      for (let key in obj) {
        if (String(obj[key]).trim().indexOf(oldVal) !== -1) {
          if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(oldVal, newVal)
          }
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          loop(oldVal, obj[key])
        }
      }
    }
    loop(oldVal, obj)
    return obj
  }


}
  export default new util()