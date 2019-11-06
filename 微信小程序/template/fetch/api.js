
 
class Api {
  constructor() {
    const environment = 'product'; // dev = 开发 | test = 测试 | demo = 演示环境 | product = 生产环境
    switch (environment) {
      case 'dev':
        this.baseUrl = 'https://front.batar.cn/';
        this.$img = 'https://img.batar.cn/';
        break;
      case 'test':
        this.baseUrl = 'https://test.oms.f.batar.cn/';
        this.$img = 'https://demo.img.batar.cn/';
        break;
      case 'demo':
        this.baseUrl = 'https://demo.oms.f.batar.cn/';
        this.$img = 'https://demo.img.batar.cn/';
        break;
      case 'product':
        this.baseUrl = 'https://f.szsjysy.com/';
        this.$img = 'https://image.szsjysy.com/';
        break;
    }

    this.interceptObj = (options) => {
      let obj = {
        200: `hanld200`,
        203: `hanld203`,
        205: `hanld205`,
        def:  `hanldDef`
      }
      return $u.switchs(options, obj, `hanldDef`)
    }

    this.resposeData = {}
  }

  // 公用请求头方法
  setHeader(form) {
    let addHeader = {
    //   accessToken: wx.getStorageSync('accessToken'),
    //   clientType: 'WXXCX'
    }
    let obj = {
      'Content-type': `application/x-www-form-urlencoded`
    }
    if(form) {
      addHeader = Object.assign(addHeader, obj)
    }
    return addHeader
  }

  // 公用拦截
  intercept(res, resolve, reject) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    const { code, data } = res.data
    res.data = $u.loopObjReplace(`997`, `足金`, res.data)
    this.resposeData = res.data
    this[this.interceptObj(code)](resolve, reject)
  }

  // 公用拦截200
  hanld200(resolve) {
    resolve(this.resposeData)
  }

  // 公用拦截203
  hanld203(resolve, reject) {
    const { msg } = this.resposeData
    reject(this.resposeData)
    $u.showToast(msg)
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }, 800)
  }

  // 公用拦截204
  hanld205(resolve, reject) {
    resolve(this.resposeData)
  }

  // 公用拦截其他状态码
  hanldDef(resolve, reject) {
    const { msg } = this.resposeData
    reject(this.resposeData)
    $u.showToast(msg)
  }

  get(url, params, needToken) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url,
        data: params,
        header: this.setHeader(),
        success(res) {
          api.intercept(res, resolve, reject)
        }
      })
    })
  }

  getLoop(url, params, needToken) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url,
        data: params,
        header: this.setHeader(),
        success(res) {
          wx.hideLoading()
          const { code } = res.data
          code === 200 && resolve(res.data)
        }
      })
    })
  }

  post(url, params, needToken) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url,
        method: 'POST',
        data: params,
        header: this.setHeader(true),
        success(res) {
          api.intercept(res, resolve, reject)
        }
      })
    })
  }

  postJson(url, params, needToken) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url,
        method: 'POST',
        data: params,
        header: this.setHeader(),
        success(res) {
          api.intercept(res, resolve, reject)
        }
      })
    })
  }

  updataAvatar(url, params) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        success(res) {
          let tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: this.baseUrl + url,
            filePath: tempFilePaths[0],
            name: 'file',
            formData: params,
            header: this.setHeader(),
            success(res) {
              res = JSON.parse(res.data)
              resolve(res)
            },
            fail() {
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            }
          })
        }
      })
    })
  }

  /**
   * Api列表 
   */

  // 上传图片
  commonUploadImg(params) {
    return api.updataAvatar('uploadImg', params)
  }

  // 查看购物车数量
  cartNum(params) {
    return api.cartList({}).then(res => {
      let { data } = res
      data = data.toString()
      if (data !== '0') {
        wx.setTabBarBadge({
          index: 2,
          text: data
        })
      } else {
        wx.removeTabBarBadge({
          index: 2,
        })
      }
    })
  }
  
  // 查看购物车数量
  cartList(params) {
    return api.get('cart/findCartsCount', params)
  }

  // 添加购物车
  addCarts(params) {
    return api.post('cart/addCarts', params)
  }

  // 尚金源加入购物车
  addBigSingleCart(params) {
    return api.postJson('cart/addBigSingleCart', params)
  }

}


let api = new Api()

export default api