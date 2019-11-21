import Vue from 'vue';
import Axios from 'axios';
import router from '@/router/index'
import Base64 from '@/skyConfig/libs/Base64';
import utils from '@/skyConfig/libs/utils';

const appConfig = {
    sign: 'abc',
    appId: 1000,
};

Axios.defaults.baseURL = process.env.NODE_ENV;
Axios.defaults.headers.clientType = 'HT';

Axios.interceptors.request.use(function(config) {
    let baseURL = Axios.defaults.baseURL;
    if (localStorage.accessToken != undefined && localStorage.accessToken != '') {
        config.headers.accessToken = utils.encrypt(`${new Date().getTime()},${localStorage.accessToken}`)
    } else {
        router.push('/login');
    }
    formartParams(config, baseURL, appConfig)
    return config;
})

Axios.interceptors.response.use(
    res => {
        if (res.config.url.includes('wechatPhone')) {
            return res
        } else if ((res.data.code == 203 || res.data.code == 202) && res.data.msg == "未登录") {
            setTimeout(function() {
                router.push('/login');
            }, 100);
        } else {
            return res;
        }

    },
    error => {});

function formartParams(config, baseURL, appConfig) {
    let accessToken = localStorage.getItem('accessToken');
    let method = config.method.toUpperCase();
    let url = config.url;
    if (method == 'GET' || method == 'DELETE') {
        let PRS = config.PRS ? config.PRS : {};
        // PRS.accessToken = accessToken;
        // PRS.clientType = 'HT';
        config.PRS = PRS;
        let params = utils.fomartParams(config.PRS);
        url = config.url + (true ? '?' : '') + params;
        config.url = url;
    } else if (method == 'PUT' || method == 'POST') {
        config.data = config.data ? config.data : {};
        // let isFormdata = 'append' in config.data

        // if (isFormdata) {
        //   config.data.append('accessToken', accessToken);
        //   config.data.append('clientType', 'HT');
        // } else {
        //   config.data.clientType = 'HT';
        //   config.data.accessToken = accessToken;
        // }
    }
}


Vue.prototype.Axios = Axios;