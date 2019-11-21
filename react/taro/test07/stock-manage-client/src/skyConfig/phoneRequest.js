import Vue from 'vue';
import Axios from 'axios';
import router from '@/router/index'
import Base64 from '@/skyConfig/libs/Base64';
import utils from '@/skyConfig/libs/utils';

const appConfig = {
  sign: 'abc',
  appId: 1000,
};

let instance = Axios.create({
  timeout: 5000
}) 

instance.defaults.baseURL = process.env.NODE_ENV;

instance.interceptors.request.use(function (config) {
  let baseURL = instance.defaults.baseURL;
  if (localStorage.accessToken != undefined) {
    config.headers.clientType = 'WXGZH';
    // config.headers.clientType = 'HT';
    config.headers.accessToken = utils.encrypt(`${new Date().getTime()},${localStorage.accessToken}`)
  } else {
    config.headers.accessToken = '';
  }
  // formartParams(config, baseURL, appConfig)
  return config;
})

instance.interceptors.response.use(res => {
  if(res.status === 500) {
    router.push({path: "wechatPhoneError", query: {err: '网络出错'}})
  }
  if(res.status === 404) {
    router.push({path: "wechatPhoneError", query: {err: '页面不存在'}})
  }
  if(res.data.code === 203) {
    localStorage.phoneError = `用户未登录`
  }else {
    localStorage.removeItem('phoneError')
  }
  return res
})

Vue.prototype.$axiosp = instance


