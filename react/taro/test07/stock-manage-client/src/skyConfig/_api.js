import Vue from 'vue';
import axios from 'axios';
import { Message } from 'element-ui';

const $portMain = process.env.API_HOST;

/**
 * post的请求方法封装
 * @param    {String}  url     请求地址
 * @param    {Object}  data    请求参数
 * @param    {String}  port    请求前缀，不传默认$portMain
 * @param    {Boolean} errMsg  请求错误是否使用弹窗提示错误信息
 * @param    {Boolean} isForm  是否使用Form请求
 * @returns  result
 *
 * @date     2019-04-27
 * @author   大雄君。（869594800@qq.com）
 */
function post({ url, data, port = false, errMsg = true, isForm = false }) {
  return new Promise((resolve, reject) => {
    let _data = data;
    if ( isForm ) {
      _data = new FormData();
      for (var i in data) {
        _data.append(i, data[i]);
      }
    }

    let _url = _getUrl(url, port);
    axios.post(_url, _data)
      .then( res => {
        const { data } = res;
        if ( data.code === 200 ) {
          resolve(data);
        } else {
          reject(data);
          _error(res, errMsg);
        }
      })
      .catch( err => {
        reject(data);
        _error(err, errMsg);
      })
  })
}

/**
 * get的请求方法封装
 * @param    {String}  url     请求地址
 * @param    {Object}  data    请求参数
 * @param    {String}  port    请求前缀，不传默认$portMain
 * @param    {Boolean} errMsg  请求错误是否使用弹窗提示错误信息
 * @returns  result
 *
 * @date     2019-04-27
 * @author   大雄君。（869594800@qq.com）
 */
function get({ url, data, port = false, errMsg }) {
  return new Promise((resolve, reject) => {
    const _url = _getUrl(url, port);
    axios.get(_url, { PRS: { ...data } })
      .then(res => {
        const { data } = res;
        if ( data.code === 200 ) {
          resolve(data);
        } else {
          reject(data);
          _error(res, errMsg);
        }
      })
      .catch( err => {
        reject(data);
        _error(err, errMsg);
      })
  })
}

// 工具类方法
function _error (res, errMsg = true) {
  const { data } = res;
  if ( data ) {
    errMsg && Message.error(data.msg || '接口请求出错：'+res.config.url);
  }
  console.warn('error', res);
}
function _getUrl( url, port ) {
  return port ? port+url : $portMain+url;
}

Vue.prototype.$Api = {
  post: post,
  get: get
}

export default {
  post: post,
  get: get
}
