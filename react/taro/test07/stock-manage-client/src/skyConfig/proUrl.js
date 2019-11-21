import Vue from 'vue';
import configUtils from './configUtils'

//接口服务器端口

// const portMain = "http://192.168.16.9:8081"; // 心杰服务器
// const portMain = 'http://192.168.16.186:8082' // 郭志刚服务器
// const portMain = 'http://192.168.21.31:8089' // 白欲波服务
// const portMain = 'http://192.168.21.161:8089' // 白欲波服务(财务系统)
// const portMain = 'http://192.168.21.185/sjy-bms-manage' //夏文浩(产品)
// const portMain = 'http://192.168.21.129:8089' // 陈祥林服务
// const portMain = "http://192.168.21.242:8082" // 订单流程
// const portMain = "http://192.168.21.202:8089" // 韦中龙
// const portMain = "http://m.szsjysy.com"; // 心杰服务器

// const portMain = 'http://192.168.16.8:8221'; // 测试服务器
// const portMain = "http://demo.bms.m.batar.cn" // 演示服务器

const portMain = configUtils.getApi().urlApi.val
const portBYB = configUtils.getApi().urlApi.val + '/stock/'; //白欲波服务

// const portImg = "http://192.168.16.103:9999/"; //图片服务器地址
// const portImg = 'http://image.szsjysy.com/' //图片服务器地址
// const uploadImg = 'http://192.168.16.3:8081';

const portImg = process.env.API_IMG;

Vue.prototype.$portMain = portMain;
Vue.prototype.$portBYB = portBYB;
Vue.prototype.$portImg = portImg;

export default {
    portMain
};