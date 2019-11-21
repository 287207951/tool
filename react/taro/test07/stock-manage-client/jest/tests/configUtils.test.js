
import api from "../../src/skyConfig/configUtils";

// 新建一个测试套件 
describe('测试后端接口是否是根据环境变量控制', () => {
    let obj = {}

    // 新建一个测试用例
    it('测试的全局的url', () => {
        expect(api.getApi(obj).urlApi.txt).toMatch(`url`);
    });

});

