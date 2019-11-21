<template>
  <div class="headWrap">
    <div class="titleWrap">
      <div class="title">{{editStatus!='新增'?editStatus:'新增'}}{{title}}</div>
      <div class="btnTop">
        <el-button
          type="primary"
          plain
          size="small"
          @click="cancelFun"
          class="right20"
          :loading="loadingTF"
        >取消</el-button>
        <div
          v-for="(item, index) in selectObj.buttonList"
          :key="item.val"
          @click="submitData(item)"
        >
          <el-button
            type="primary"
            size="small"
            :plain="index === 0"
            :loading="loadingTF"
          >{{item.txt}}</el-button>
        </div>
      </div>
    </div>

    <el-row style="margin-top: 46px;">
      <el-col :span="24" style="margin-bottom: 16px;" v-if="mode !== 'TRANSFER'">
        <span class="smallTitle">{{title}}类型</span>
        <el-select
          v-model="params.bizType"
          placeholder="请选择"
          size="small"
          class="width240"
          :disabled="disabled"
          @change="typeFun"
        >
          <el-option
            v-for="item in selectObj.bizTypeList"
            :key="item.val"
            :label="item.txt"
            :value="item.val"
          ></el-option>
        </el-select>
        <span class="txtRed left10 txt16">*</span>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">发起单位</span>
        <el-select
          v-if="selectObj.sendSelectType === `select`"
          v-model="params.send"
          placeholder="请选择"
          size="small"
          class="width240"
          :disabled="disabled"
          @click.native="sendClick"
          @change="getSend"
        >
          <el-option
            v-for="item in selectObj.sendList"
            :key="item.val"
            :label="item.txt"
            :value="item.val"
          ></el-option>
        </el-select>

        <el-select
          v-if="selectObj.sendSelectType === `remote`"
          v-model="params.send"
          filterable
          remote
          reserve-keyword
          placeholder="请输入"
          :remote-method="remoteMethod"
          @focus="remoteMethod('')"
          @click.native="sendClick"
          @change="getSend"
          :loading="searchloading"
          size="small"
          class="width240"
        >
          <el-option
            v-for="item in selectObj.sendList"
            :key="item.val"
            :label="item.txt"
            :value="item.val"
          ></el-option>
        </el-select>

        <span class="txtRed left10 txt16">*</span>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">接收单位</span>

        <el-select
          v-if="selectObj.receiveSelectType === `select`"
          v-model="params.receive"
          placeholder="请选择"
          size="small"
          class="width240"
          :disabled="disabled"
          @click.native="getClick"
          @change="getReceive"
        >
          <el-option
            v-for="item in selectObj.receiveList"
            :key="item.val"
            :label="item.txt"
            :value="item.val"
            :disabled="item.disabled"
          ></el-option>
        </el-select>

        <el-select
          v-if="selectObj.receiveSelectType === `remote`"
          v-model="params.receive"
          filterable
          remote
          reserve-keyword
          placeholder="请输入"
          :remote-method="remoteMethod"
          @focus="remoteMethod('')"
          @click.native="getClick"
          @change="getReceive"
          :loading="searchloading"
          size="small"
          class="width240"
        >
          <el-option
            v-for="item in selectObj.receiveList"
            :key="item.val"
            :label="item.txt"
            :value="item.val"
          ></el-option>
        </el-select>

        <span class="txtRed left10 txt16">*</span>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">备注</span>
        <el-input
          v-model="params.remark"
          @input="emitData"
          placeholder="请输入备注"
          size="small"
          class="width240"
        ></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    // STOCK_IN = 入库单据, STOCK_OUT = 出库单据 , TRANSFER = 调拨单据
    mode: {
      type: String
    },
    //编辑、新增
    editStatus: {
      type: String
    },
    orderDetail: {
      type: Object
    },
    // 添加的产品
    proList: {
      type: Array,
      default() {
        return [];
      }
    },
    // 添加的包
    packagePro: {
      type: Array,
      default() {
        return [];
      }
    },
    // 那个select触发提示 1发起单位 2接收单位
    selectClick: {
      type: String
    },
    loadingTF: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 数据回填 RECEIVE_CLIENT 入库回填客户列表 RECEIVE_FACTORY 入库回填工厂列表 send为工厂
    // 数据回填 SEND_CLIENT 出库回填客户列表 SEND_FACTORY 出库回填工厂列表 send为工厂
    bizTypeBack: {
      type: String
    }
  },
  data() {
    return {
      searchloading: false,

      // 入口判断映射
      entryObj: {
        STOCK_IN: `getStoreInList`, // 入库
        STOCK_OUT: `getStoreOutList`, // 出库
        TRANSFER: `getTransferList` // 调拨出库
      },

      // 页面数据配置
      selectObj: {
        loaded: false, // 加载完数据后改编值
        sendList: [], // 发起单位
        sendSelectType: `select`, // select：select  remote：remote-select
        receiveList: [], // 接收单位
        receiveSelectType: `select`,
        bizTypeList: [], // 入库类型
        buttonList: [], // 按钮
        clientList: [], // 客户列表
        facList: [], // 工厂列表
        remark: `` // 备注
      },

      // 客户搜索功能配置
      clientSelectObj: {
        RECEIVE_CLIENT: [`_SHOP,_VOL`], //  '收工厂饰'业务类型下对应的是 '工厂'. '收客户饰' 业务类型下对应的是 '门店'/'大客户'.
        RECEIVE_FACTORY: [`_FACTORY`], //  '收工厂饰'业务类型下对应的是 '工厂'. '收客户饰' 业务类型下对应的是 '门店'/'大客户'.
        SEND_CLIENT: [`_SHOP,_VOL`],
        SEND_FACTORY: [`_FACTORY`]
      },

      // 出口参数配置
      params: {
        bizType: ``, // 入库类型
        send: ``, // 发起单位
        sendItem: {},
        receive: ``, // 接受单位
        receiveItem: {},
        remark: `` // 备注
      },

      // 执行select数据回填
      bizTypeBackObj: {
        RECEIVE_CLIENT: `setStockInClient`,
        RECEIVE_FACTORY: `setStockInFac`,
        SEND_CLIENT: `setStockOutClient`,
        SEND_FACTORY: `setStockOutFac`
      },

      cancel: false
    };
  },
  async created() {
    // await this.getOtherUnit();
    // await this.getOtherUnitFac();
    await this.getBizTypeList();
  },
  watch: {
    orderDetail: function(newVal, oldVal) {
      // 订单数据回填
      this.params = newVal;
    },
    bizTypeBack: function(newVal, oldVal) {
      this.setBackSelect(newVal);
    }
  },
  methods: {
    sendClick() {
      if (
        (this.proList.length !== 0 || this.packagePro.length !== 0) &&
        this.selectClick === `1`
      ) {
        this.$message.warning(`切换会清空产品`);
      }
    },

    getClick() {
      if (
        (this.proList.length !== 0 || this.packagePro.length !== 0) &&
        this.selectClick === `2`
      ) {
        this.$message.warning(`切换会清空产品`);
      }
    },

    setBackSelect(option) {
      const {
        selectObj: { loaded }
      } = this;
      if (loaded) {
        this.setSelectStatus();
        this[this.bizTypeBackObj[option]]();
        this.backDownSelect(option);
        return;
      }
      setTimeout(() => {
        this.setBackSelect(option);
      }, 200);
    },

    // 回填选择的输入下拉 TODO
    backDownSelect(option) {
      console.log(this.params, option);
      const {
        sendItem: { txt },
        receiveItem: { companyName }
      } = this.params;
      // 收工厂饰品
      if (option === `RECEIVE_FACTORY`) {
        this.remoteMethod(txt);
      }
      // 收客户饰品
      if (option === `RECEIVE_CLIENT`) {
        this.remoteMethod(txt);
      }
      // 出工厂饰品
      if (option === `SEND_FACTORY`) {
        this.remoteMethod(companyName);
      }
      // 出客户饰品
      if (option === `SEND_CLIENT`) {
        this.remoteMethod(companyName);
      }
    },

    // 根据单据类型标识查询可做业务类型
    getBizTypeList() {
      const { mode: invoiceType, entryObj } = this;
      const params = {
        PRS: {
          invoiceType
        }
      };
      this.$axios
        .get(`${this.$portMain}/biz/conf/bizFormConf`, params)
        .then(res => {
          this[entryObj[invoiceType]](res.data.data);
          this.selectObj.loaded = true;
        });
    },

    // select两个数据不重复
    selectNoRepet(trueClick, beforArr, afterArr) {
      let arr = [];
      beforArr.forEach(item => {
        afterArr.forEach(it => {
          if ((item.val === it.val) === trueClick) {
            item.disabled = true;
          }
        });
      });
    },

    getSend(e) {
      const {
        params,
        selectObj: { sendList, receiveList }
      } = this;
      sendList.forEach(item => {
        if (item.val == e) {
          params.sendItem = item;
        }
      });
      receiveList.forEach(ielem => {
        if (params.send === ielem.id) {
          ielem.disabled = true;
        } else {
          ielem.disabled = false;
        }
      });
      this.selectNoRepet(e, sendList, receiveList);
      this.emitData();
      this.$emit("launchChange");
    },

    getReceive(e) {
      const {
        params,
        selectObj: { sendList, receiveList }
      } = this;
      receiveList.forEach(item => {
        if (item.val == e) {
          params.receiveItem = item;
        }
      });
      this.selectNoRepet(e, receiveList, sendList);
      this.emitData();
    },

    // 设置入库筛选 工厂
    setStockInFac() {
      let {
        selectObj: { clientList: sendList }
      } = this;
      let obj = {};
      obj = {
        selectMode: `RECEIVE_FACTORY`,
        sendList
      };
      this.selectObj = { ...this.selectObj, ...obj };
      this.params = { ...this.params };
    },

    // 设置入库筛选 客户 TODO
    setStockInClient() {
      let {
        selectObj: { clientList: sendList }
      } = this;
      let obj = {};
      obj = {
        selectMode: `RECEIVE_CLIENT`,
        sendList
      };
      this.selectObj = { ...this.selectObj, ...obj };
      this.params = { ...this.params };
    },

    // 设置出库筛选 工厂
    setStockOutFac() {
      let {
        selectObj: { clientList: receiveList }
      } = this;
      let obj = {};
      obj = {
        selectMode: `SEND_FACTORY`,
        receiveList
      };
      this.selectObj = { ...this.selectObj, ...obj };
      this.params = { ...this.params };
    },

    // 设置出库筛选 客户
    setStockOutClient() {
      let {
        selectObj: { clientList: receiveList }
      } = this;
      let obj = {};
      obj = {
        selectMode: `SEND_CLIENT`,
        receiveList
      };
      this.selectObj = { ...this.selectObj, ...obj };
      this.params = { ...this.params };
    },

    // 类型事件
    typeFun(e) {
      this.emitData();
      this.$emit("typeFun");
      let {
        mode,
        selectObj,
        selectObj: { facList, clientList },
        params
      } = this;
      let obj = {};
      this.setSelectStatus();
      if (mode === `STOCK_IN`) {
        this.params.send = ``;
        this.selectObj.sendList = [];
        // 收工厂饰品
        if (e === `RECEIVE_FACTORY`) {
          this.setStockInFac();
        }
        // 收客户饰品
        if (e === `RECEIVE_CLIENT`) {
          this.setStockInClient();
        }
      }
      if (mode === `STOCK_OUT`) {
        this.params.receive = ``;
        this.selectObj.receiveList = [];
        // 出工厂饰品
        if (e === `SEND_FACTORY`) {
          this.setStockOutFac();
        }
        // 出客户饰品
        if (e === `SEND_CLIENT`) {
          this.setStockOutClient();
        }
      }
    },

    // 设置select状态
    setSelectStatus() {
      if (this.mode === `STOCK_IN`) {
        this.selectObj.sendSelectType = `remote`;
        this.selectObj.receiveSelectType = `select`;
      }
      if (this.mode === `STOCK_OUT`) {
        this.selectObj.sendSelectType = `select`;
        this.selectObj.receiveSelectType = `remote`;
      }
    },

    // 设置客户
    setClient() {
      let {
        mode,
        selectObj: { selectMode }
      } = this;
      if (mode === `STOCK_IN`) {
        // 收工厂饰品
        if (selectMode === `RECEIVE_FACTORY`) {
          this.setStockInFac();
        }
        // 收客户饰品
        if (selectMode === `RECEIVE_CLIENT`) {
          this.setStockInClient();
        }
      }
      if (mode === `STOCK_OUT`) {
        // 出工厂饰品
        if (selectMode === `SEND_FACTORY`) {
          this.setStockOutFac();
        }
        // 出客户饰品
        if (selectMode === `SEND_CLIENT`) {
          this.setStockOutClient();
        }
      }
    },

    //数据修改时传值
    emitData() {
      const { params } = this;
      this.$emit("change", params);
    },

    //点击“提交”传值
    submitData(e) {
      const { params } = this;
      Object.assign(params, { btnStatus: e.val });
      if (e.val === `WAITCONFIRM`) {
        this.$api.refClick(this).then(res => {
          this.$emit("submitData", params);
        });
      } else {
        this.$emit("submitData", params);
      }
    },

    //取消按据
    cancelFun() {
      const { params } = this;
      this.$emit("cancelData", params);
    },

    // 改变获取到数据的格式
    changeData(options) {
      const {
        sendRepos,
        bizTypeList,
        bizAuxiliary: { buttons },
        receiveRepos
      } = options;
      if (sendRepos) {
        sendRepos.forEach(item => {
          item.val = item.id;
          item.txt = item.name;
        });
      }
      if (bizTypeList) {
        bizTypeList.forEach(item => {
          item.val = item.bizType;
          item.txt = item.bizName;
        });
      }
      if (buttons) {
        buttons.forEach(item => {
          item.val = item.actionSign;
          item.txt = item.actionName;
        });
      }
      if (receiveRepos) {
        receiveRepos.forEach(item => {
          item.val = item.id;
          item.txt = item.name;
        });
      }
      options.buttonList = buttons;
      return options;
    },

    getStoreInList(options) {
      options = this.changeData(options);
      let {
        selectObj,
        selectObj: { receiveList },
        btnList
      } = this;
      const { sendRepos, bizTypeList, buttonList } = options;
      let obj = {
        sendList: receiveList ? receiveList : [],
        receiveList: sendRepos,
        bizTypeList,
        buttonList
      };
      this.selectObj = { ...selectObj, ...obj };
    },

    getStoreOutList(options) {
      options = this.changeData(options);
      let {
        selectObj,
        selectObj: { receiveList },
        btnList
      } = this;
      const { sendRepos: sendList, bizTypeList, buttonList } = options;
      let obj = {
        sendList,
        receiveList: receiveList ? receiveList : [],
        bizTypeList,
        buttonList
      };
      this.selectObj = { ...selectObj, ...obj };
    },

    getTransferList(options) {
      options = this.changeData(options);
      let { selectObj, btnList } = this;
      const {
        sendRepos: sendList,
        receiveRepos: receiveList,
        bizTypeList,
        buttonList
      } = options;

      let obj = {
        sendList,
        receiveList,
        bizTypeList: [],
        buttonList
      };
      this.selectObj = { ...selectObj, ...obj };
    },

    // _BANK = 银行, _FACTORY=工厂, _SHOP = 门店 , _VOL = 大客户;
    // 如果不填, 将搜索所有类型的"客户", 如果在多种类型中搜索,
    // 多个值用,分隔; 如 _SHOP,_VOL 表示只搜索 大客户和门店.
    // 下拉搜索
    remoteMethod(query) {
      console.log(query);
      //   if (!query) {
      //     return;
      //   }
      const {
        clientSelectObj,
        selectObj: { selectMode }
      } = this;
      this.searchloading = true;
      let params = {
        PRS: {
          clientScope: clientSelectObj[selectMode],
          keyWord: query
        }
      };
      this.$axios
        .get(this.$portMain + "/client/rawClientSimple", params)
        .then(res => {
          if (res.data.code == 200) {
            let arr = res.data.data;
            arr.forEach(item => {
              item.txt = item.companyName;
              item.val = item.companyId;
            });
            this.selectObj.clientList = arr;
            this.setClient();
            this.searchloading = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.width240 {
  width: 240px;
}

.smallTitle {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #8A8E99;
}

.headWrap {
  padding-bottom: 24px;

  .titleWrap {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #232426;
    }

    .btnTop {
      display: flex;

      > div {
        margin-right: 10px;
      }
    }
  }
}
</style>
