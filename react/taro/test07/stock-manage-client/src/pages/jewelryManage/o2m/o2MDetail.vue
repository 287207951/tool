<template>
  <div class="outOfStock"
       ref="creatSendMaterial"
       v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right"
                   class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>饰转料(发起)详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"></div>
    <el-card style="margin-bottom:10px;">
      <div slot="header"
           class="card-head">
        <span style="font-weight:bold">新建转料</span>
        <div>
          <el-button type="primary"
                     plain
                     @click="cancel"
                     size="small">取消</el-button>
          <el-button type="primary"
                     @click="save"
                     size="small">保存</el-button>
          <el-button type="primary"
                     plain
                     @click="submit"
                     size="small">提交</el-button>
        </div>
      </div>
      <div>
        <el-form :model="newForm"
                 :rules="newFormRues"
                 ref="newForm"
                 label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="发起单位"
                            prop="initiatorId">
                <el-select v-model="newForm.initiatorId"
                           placeholder="请选择"
                           size="small"
                           @change="initiatorIdChange">
                  <el-option v-for="item in initiatorOptions"
                             :disabled="item.disabled"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接收单位"
                            prop="recipientId">
                <el-select v-model="newForm.recipientId"
                           placeholder="请选择"
                           size="small"
                           @change="recipientIdChange">
                  <el-option v-for="item in recipientOptions"
                             :disabled="item.disabled"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单据备注">
                <el-input type="textarea"
                          v-model="newForm.invoiceMark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card>
      <div slot="header"
           class="card-head">
        <span style="font-weight:bold">已选SKU</span>
        <div>
          <el-button type="primary"
                     plain
                     @click="openProDialog"
                     size="small">添加产品</el-button>
        </div>
      </div>
      <div>
        <SkuScreen @suitSearch="searchFun"
                   :proList="selectedProList">
        </SkuScreen>
      </div>
    </el-card>
    <el-dialog title="添加产品"
               width="1500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               height="720px"
               @close="closeAddDialog"
               :visible.sync="addProDiaVisi">
      <el-row>
        <span class="add-pro-label">发起单位：</span>
        <span class="add-pro-value">{{newForm.initiator}}</span>
      </el-row>
      <el-form inline
               :model="addProSearchForm"
               ref="addProSearchForm">
        <el-form-item label="">
          <el-input v-model="addProSearchForm.search"
                    @blur="reloadAddProList"
                    size="small"
                    style="width:256px"
                    placeholder="请输入关键字搜索">
            <i slot="prefix"
               class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="addProSearchForm.one"
                     @change="reloadAddProList"
                     placeholder="请选择"
                     size="small">
            <el-option v-for="item in proDeiData.one_items_code"
                       :key="item.code"
                       :label="item.val"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产工艺">
          <el-select v-model="addProSearchForm.processCode"
                     @change="reloadAddProList"
                     placeholder="请选择"
                     size="small">
            <el-option v-for="item in proDeiData.pro_process_code"
                       :key="item.code"
                       :label="item.val"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成色">
          <el-select v-model="addProSearchForm.conditi"
                     @change="reloadAddProList"
                     placeholder="请选择"
                     size="small">
            <el-option v-for="item in proDeiData.condition_code"
                       :key="item.code"
                       :label="item.val"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary"
                     size="small"
                     @click="confirmSelected">确认选中</el-button>
        </el-form-item>
      </el-form>
      <div class="infinite-list-wrapper">
        <div v-for="(item) in searchProList"
             :key="item.factoryId">
          <product-row style="padding-left:8px;padding-right:8px;"
                       :imgBaseUrl="$portImg"
                       :productData="item"
                       :layoutSetting="dialogProductLayout"
                       titleKey="proName"
                       imgUrlKey="url">
            <div slot="prepend"
                 style="margin-right:10px;">
              <el-checkbox v-model="item._checked"
                           :disabled="item._disabled"></el-checkbox>
            </div>
            <div slot="append"
                 class="product-row-append">
              <div class="product-row-append-item">
                <div class="duad">
                  <div class="label">转料数量:</div>
                  <div>
                    <el-input-number v-model="item._num"
                                     size="mini"
                                     :min="0"
                                     :max="item.amount"
                                     @focus="inputFocus(item)"
                                     label="描述文字"></el-input-number>
                  </div>
                </div>
                <div class="duad"
                     v-if="isFictitiousStore">
                  <div class="label">转料毛重:</div>
                  <div>
                    <el-input size="mini"
                              placeholder="转料毛重"
                              @focus="inputFocus(item)"
                              @change="numberCtrl(item,'_weight')"
                              v-model="item._weight">
                      <template slot="append">g</template>
                    </el-input>
                  </div>
                </div>
                <div class="duad"
                     v-if="isFictitiousStore">
                  <div class="label">转料净重:</div>
                  <div>
                    <el-input size="mini"
                              placeholder="转料净重"
                              @focus="inputFocus(item)"
                              v-model="item._suttle"
                              @blur="suttleBlur(item)"
                              @change="numberCtrl(item,'_suttle')">
                      <template slot="append"
                                style="padding:0;">g</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="product-row-append-item">
                <div class="duad">
                  <div class="label">转料原因:</div>
                  <div>
                    <el-select v-model="item._reason"
                               @focus="inputFocus(item)"
                               multiple
                               placeholder="请选择"
                               size="mini">
                      <el-option v-for="item in materialReasonOptions"
                                 :key="item.value"
                                 :label="item.value"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="duad">
                  <div class="label top">转料备注:</div>
                  <div>
                    <el-input type="textarea"
                              @focus="inputFocus(item)"
                              size="mini"
                              v-model="item._desc"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="dropdown-container"
                 v-if="item.map && item.map.proList"
                 slot="dropdown">
              <product-row class="dropdown-item"
                           v-for="proItem in item.map.proList"
                           :key="proItem.id"
                           :imgBaseUrl="$portImg"
                           :productData="proItem"
                           :layoutSetting="tzLayout"
                           titleKey="name"
                           imgUrlKey="pic"></product-row>
            </div>
          </product-row>
        </div>
        <infinite-loading @infinite="infiniteLoad"
                          ref="infiniteLoading"
                          :identifier="infinite.infiniteId"
                          direction="bottom"
                          :distance="40">
          <div slot="no-more">没有更多了</div>
          <div slot="no-results">暂无数据!</div>
          <loading></loading>
        </infinite-loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import productRow from '@/components/product-row.vue'
export default {
  computed: {
    // 选择的是否是虚拟仓
    isFictitiousStore () {
      return this.newForm.initiatorRepoType === 'FICTITIOUS'
    }
  },
  components: {
    'product-row': productRow,
  },
  data () {
    return {
      // 套装键值对配置
      tzLayout: [
        [
          {
            label: '编号',
            valueKey: 'factoryNumber'
          },
          {
            label: '属性',
            valueFormat (data) {
              return [data.goldCode, data.condit, data.oneName, data.effect, data.processCode].filter((n) => n).join(',')
            },
            valueKey: 'proBasics.goldCode',
          },
        ],
        [
          {
            label: '克重',
            valueKey: 'weight'
          }
        ]
      ],
      // 产品键值对配置
      dialogProductLayout: [
        [
          {
            label: '编码',
            valueKey: 'proNumber'
          },
          {
            label: '属性',
            valueFormat (data) {
              return [data.goldCode, data.condit, data.oneName, data.effect, data.processCode].filter((n) => n).join(',')
            },
            custom: function (data) {
              if (data.oneItemsCode && data.oneItemsCode === 'TZ') {
                return '套装详情'
              }
            },
            valueKey: 'proBasics.goldCode',
          },
        ],
        [
          {
            label: '成色',
            valueKey: 'conditi'
          },
          {
            label: '克重',
            valueKey: 'weight'
          },
          {
            specialFn: (data) => {
              if (data.proSpecData && data.proSpecData.extendAttr) {
                const obj = JSON.parse(data.proSpecData.extendAttr);
                if (!this.$api.isEmptyJson(obj) && data.proBasics.one) {
                  return this.$api.getExtendAttr(data.proBasics.one, obj)
                } else {
                  return {}
                }
              }
              return {}
            },
          },
        ],
        [
          {
            label: '剩余库存',
            valueKey: 'amount'
          },
          {
            label: '库存毛重',
            valueKey: '_goldSuttle'
          },
          {
            label: '库存净重',
            valueKey: 'goldWeight'
          },
        ],

      ],
      infinite: {
        loading: false,
        noMore: false,
        infiniteId: +new Date(),
        page: 1,
        rows: 10,
      },
      proDeiData: {
        one_items_code: [],
        pro_process_code: [],
        condition_code: []
      },
      //  添加产品弹窗
      addProDiaVisi: false,
      // 发起单位options
      initiatorOptions: [],
      // 接收单位options
      recipientOptions: [],
      // 转料原因OPTIONS
      materialReasonOptions: [
        {
          value: "质量问题"
        },
        {
          value: "当料"
        }
      ],
      // 表单
      newForm: {
        initiatorId: '',
        initiator: '',
        initiatorRepoId: '',
        initiatorRepoType: '',
        recipientId: '',
        recipient: '',
      },
      // 添加产品搜索表单
      addProSearchForm: {
        search: '',
        processCode: '',
        conditi: '',
        one: '',
      },
      // 搜索后的产品列表
      searchProList: [],
      // 已选择的产品
      selectedProList: [],
      // 表单验证规则
      newFormRues: {
        initiatorId: [
          { required: true, message: '请选择发起单位', trigger: 'change' },
        ],
        recipientId: [
          { required: true, message: '请选择接收单位', trigger: 'change' },
        ]
      }
    }
  },

  created () {
    this.getInitiatorOptions()
    this.getAddProOptions()
  },

  methods: {

    // 取消按钮回调
    cancel () {

    },
    // 保存按钮回调
    save () {

    },
    // 提交按钮回调
    submit () {
      // 表单验证
      this.$refs.newForm.validate((valid) => {
        if (valid) {
          if (this.selectedProList.length) {

          } else {
            this.$message.error('请添加产品')
          }
        } else {
          return false;
        }
      })
    },
    // 转料净重失去焦点的事件回调
    suttleBlur (item) {
      if (item._weight == 0) {
        item._weight = item._suttle
      }
    },
    // 确认选中按钮点击
    confirmSelected () {
      const arr = this.searchProList.filter((n) => n._checked)
      let errorMessage = '';
      let isPass;
      if (arr.length) {
        isPass = arr.every((n) => {
          if (n._suttle > n._weight) {
            errorMessage = '选择的产品转料净重不能大于转料毛重！'
            return false
          }
          if (this.isFictitiousStore) {
            errorMessage = '选择的产品必须填写转料数量、转料毛重、转料净重！'
            return n._num && n._suttle
          } else {
            errorMessage = '选择的产品必须填写转料数量！'
            return n._num
          }
        })
        if (isPass) {
          const selectedIds = this.selectedProList.map((n) => n.id)
          const arrIds = arr.map((j, k) => j.id)
          selectedIds.forEach((n, i) => {
            const selectedIndex = arrIds.indexOf(n)
            if (selectedIndex !== -1) {
              this.$set(this.selectedProList[i], '_num', Number(this.selectedProList[i]._num) + Number(arr[selectedIndex]._num))
              this.$set(this.selectedProList[i], '_weight', Number(this.selectedProList[i]._weight) + Number(arr[selectedIndex]._weight))
              this.$set(this.selectedProList[i], '_suttle', Number(this.selectedProList[i]._suttle) + Number(arr[selectedIndex]._suttle))
              // SET 数组去重
              this.$set(this.selectedProList[i], '_reason', [...new Set(this.selectedProList[i]._reason.concat(arr[selectedIndex]._reason))])
              this.$set(this.selectedProList[i], '_desc', this.selectedProList[i]._desc + ',' + arr[selectedIndex]._desc)
              delete arr.splice(selectedIndex, selectedIndex + 1)
            }
          })
          if (arr.length) {
            this.selectedProList.push(...arr)
          }
          this.closeAddDialog()
        } else {
          this.$message.error(errorMessage)
        }

      } else {
        this.$message.error('请选择产品')
      }
    },
    // 无限滚动加载
    infiniteLoad ($state) {
      this.getSearchProList().then((data) => {
        $state.loaded()
        this.infinite.page++
        if (this.infinite.page * this.infinite.rows >= data.rowSize) {
          $state.complete()
        }
        this.searchProList = this.searchProList.concat(data.data)
      })
    },
    getSearchProList () {
      const params = {
        ...this.addProSearchForm,
        storeId: this.newForm.initiatorId,
        page: this.infinite.page,
        rows: this.infinite.rows,
      }
      return new Promise((resolve, reject) => {
        this.$api
          .urlPost(
            this.$portMain + "/proCommonController/repertoryShowList",
            params
          ).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data;
              data.data.forEach((n) => {
                n._goldSuttle = n.goldWeight;
                n._checked = false;
                if (n.amount == 0 || n.goldWeight == 0) {
                  n._disabled = true;
                } else {
                  n._disabled = false;
                }
                n._num = 0;
                n._weight = 0;
                n._suttle = 0;
                n._reason = '';
                n._desc = '';
              })
              if (this.selectedProList.length) {
                data.data.forEach((n, i) => {
                  const selectedIndex = this.selectedProList.map((n) => n.id).indexOf(n.id)
                  if (selectedIndex !== -1) {
                    n.amount -= this.selectedProList[selectedIndex]._num
                    n.goldWeight -= this.selectedProList[selectedIndex]._weight
                    n._goldSuttle -= this.selectedProList[selectedIndex]._suttle
                  }
                })
              }
              resolve(data)
            } else {
              this.$message.error(res.data.msg);
            }
          })
      })
    },
    reloadAddProList () {
      this.searchProList = []
      this.infinite.page = 1;
      this.infinite.infiniteId++
      this.getSearchProList().then((data) => {
        if (this.infinite.page * this.infinite.rows >= data.rowSize) {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
        }
        this.$set(this, 'searchProList', data.data)
      })
    },
    // 获取添加产品下拉框数据源
    getAddProOptions () {
      this.$axios
        .get(this.$portMain + "/proCommonController/code")
        .then(res => {
          if (res.data.code == 200) {
            this.proDeiData = res.data.data;
            let allTxtObj = { val: "全部", code: "" };
            this.proDeiData.one_items_code.unshift(allTxtObj);
            this.proDeiData.gold_material_code.unshift(allTxtObj);
            this.proDeiData.pro_process_code.unshift(allTxtObj);
            this.proDeiData.condition_code.unshift({
              val: "全部",
              code: "全部"
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 发起单位change事件
    initiatorIdChange (val) {
      this.selectedProList = [];
      const curCnitiator = this.initiatorOptions.filter((n) => n.id === val)[0]
      const disabledOption = this.recipientOptions.filter((n) => n.id === val)[0];
      this.recipientOptions.forEach((n) => {
        this.$set(n, 'disabled', false)
      })
      if (disabledOption) {
        this.$set(disabledOption, 'disabled', true)
      }
      this.newForm.initiator = curCnitiator.name
      this.newForm.initiatorRepoId = curCnitiator.secId
      this.newForm.initiatorRepoType = curCnitiator.type
      this.$set(this, 'selectedProList', [])
    },
    // 接收单位change事件
    recipientIdChange (val) {
      const curCnitiator = this.recipientOptions.filter((n) => n.id === val)[0]
      const disabledOption = this.initiatorOptions.filter((n) => n.id === val)[0];
      this.initiatorOptions.forEach((n) => {
        this.$set(n, 'disabled', false)
      })
      if (disabledOption) {
        this.$set(disabledOption, 'disabled', true)
      }
      this.newForm.recipient = curCnitiator.name
    },
    // 获取发起单位、接受单位等下拉框数据源
    getInitiatorOptions () {
      const params = {
        PRS: {
          invoiceType: 'TRANSFER'
        }
      };
      this.$axios
        .get(`${this.$portMain}/biz/conf/bizFormConf`, params)
        .then(res => {
          this.initiatorOptions = res.data.data.sendRepos;
          this.recipientOptions = res.data.data.receiveRepos;
        });
    },
    //sku筛选
    searchFun (elem) {
      this.confirmProdcutData = elem.backProList;
    },
    // 添加产品弹窗
    openProDialog () {
      this.searchProList = [];
      this.infinite.page = 1;
      this.infinite.infiniteId++
      if (this.newForm.initiatorId.toString()) {
        this.infinite.noMore = false
        this.addProDiaVisi = true
      } else {
        this.$message.error('请选择发起单位！')
      }
    },
    // 关闭添加产品弹窗
    closeAddDialog () {
      this.addProDiaVisi = false
      Object.keys(this.addProSearchForm).forEach((n) => {
        this.addProSearchForm[n] = ''
      })
    },
    // 控制输入框为数字
    numberCtrl (item, key) {
      if (isNaN(item[key])) {
        item[key] = 0;
      }
    },
    // input获取焦点时事件回调
    inputFocus (item) {
      if (!item._disabled) {
        item._checked = true
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  margin-top: -8px;
  margin-bottom: -8px;
}

.add-pro-label {
  font-weight: bold;
  font-size: 16px;
  color: #8A9199;
}

.add-pro-value {
  font-weight: bold;
  font-size: 16px;
  color: #232426;
}

.infinite-list-wrapper {
  height: 400px;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto;
}

.product-row-append {
  display: flex;
  flex: 2.5;

  .product-row-append-item {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding-right: 15px;
  }

  .duad {
    display: flex;
    align-items: center;
    padding-bottom: 6px;

    .label {
      padding-right: 8px;
      color: #889199;

      &.top {
        align-self: flex-start;
      }
    }
  }
}

.dropdown-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .dropdown-item {
    width: 50%;
    box-sizing: border-box;
  }
}
</style>
