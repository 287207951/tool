
// api配置
const getApi = (obj) => {

    obj = obj || this

    // 测试的url 可添加多个 需要切换环境测试 给this.urlApi 赋值
    // 禁止修改 this.url this.urlH5
    obj.testUrl = {
        txt: `testUrl`,
        val: `http://192.168.16.9:8081`,
    }

    obj.url = {
        txt: `url`,
        val: process.env.API_HOST
    }

    obj.urlApi = obj.url
    return obj
}

export default {
    getApi
}