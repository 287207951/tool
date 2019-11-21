<template>
  <div>
    <div class="tzDetails" v-for="(ielem,indOne) in auitData.proSpecData.ProList" :key="indOne">
      <div class="uLOne" style="width:65%">
        <img
          :src="ielem.pic?$portImg+ielem.pic:'../../../../../static/images/img-noimg.png'"
          :class="{'mL22':styleType}"
          @click="showPic(ielem.pic?$portImg+ielem.pic:'../../../../../static/images/img-noimg.png')"
          alt
        />
        <div class="liDes">
          <div>{{ielem.name}}</div>
          <div>
            <span class="grayCol">编号：</span>
            <span>{{ielem.factoryNumber}}</span>
          </div>
          <div>
            <span class="grayCol">属性：</span>
            <span>
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="getTzAttrs(ielem)"
              >
                <span
                  class="txtBlack overflowHidden"
                  slot="reference"
                >{{getTzAttrs(ielem).length <9 ? getTzAttrs(ielem) : getTzAttrs(ielem).substr(0, 9)+'...'}}</span>
              </el-popover>
            </span>
          </div>
        </div>
      </div>
      <div class="uLTwo">
        <div>
          <span class="grayCol">克重：</span>
          <span>{{ielem.weight?ielem.weight+'g':'-'}}</span>
        </div>
        <div>
          <!-- 扩展属性（手寸，链长） -->
          <b
            v-if="ielem.extend && ielem.one"
            v-html="$api.getAttachProperty(ielem.one,ielem.extend)"
          ></b>&nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    styleType: {
      type: Boolean,
      default: false
    },
    auitData: {
      required: true
    }
  },
  data() {
    return {
      arrowType: false,
      auitData: {}
    };
  },
  created() {},
  mounted() {},
  // watch: {
  //   auitData: function (newVal, oldVal) {
  //     this.auitData = newVal;
  //     this.auitData.proSpecData.ProList.forEach(ielem => {
  //       ielem.codeList = [];
  //       if (ielem.goldCode) {
  //         //材质
  //         ielem.codeList.push(ielem.goldCode);
  //       }
  //       if (ielem.condit) {
  //         //成色
  //         ielem.codeList.push(ielem.condit);
  //       }
  //       if (ielem.oneName) {
  //         //类别
  //         ielem.codeList.push(ielem.oneName);
  //       }
  //       if (ielem.effect) {
  //         //工艺
  //         ielem.codeList.push(ielem.effect);
  //       }
  //       if (ielem.processCode) {
  //         //生产工艺
  //         ielem.codeList.push(ielem.processCode);
  //       }
  //       ielem.codeTxt = ielem.codeList.join(",");
  //     });
  //   }
  // },
  computed: {},
  methods: {
    getTzAttrs(data) {
      const arr = ["goldCode", "condit", "oneName", "effect", "processCode"];
      const arr2 = [];
      arr.forEach(item => {
        if (data[item]) {
          arr2.push(data[item]);
        }
      });
      return arr2.join(",");
    },
    //关闭
    suitDes() {
      this.arrowType = !this.arrowType;
      // this.$parent.suitDes();
      // console.log(this.$parent);
    },
    //查看大图
    showPic(item) {
      this.$emit("showPic", item);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tzDetails {
  width: 49%;
  display: inline-flex;
  margin-bottom: 20px;

  .grayCol {
    color: #889199;
  }

  .redCol {
    color: #F20F34;
  }

  .uLOne {
    display: flex;

    img {
      width: 120px;
      height: 90px;
    }

    .liDes {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  .uLTwo {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  // 更多
  .more {
    display: inline-block;
    position: relative;
    cursor: pointer;

    strong {
      color: #df343d;
      font-weight: bold;
    }

    .dialog {
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 100%;
      width: 250px;
      box-sizing: border-box;
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;

      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #37393b;
      }

      p {
        padding-top: 10px;
        line-height: 1.4;
        font-size: 12px;
        color: #3c3c3c;
      }
    }

    &:hover .dialog {
      visibility: visible;
    }
  }

  .mL22 {
    margin-left: 22px;
  }
}
</style>
