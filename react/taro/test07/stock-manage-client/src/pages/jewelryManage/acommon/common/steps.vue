<template>
  <el-col :span="16" class="top10">
    <el-steps :active="getActive" class="Steps">
      <el-step
        v-for="(item, index) in data"
        :key="index"
        :title="item.processName?item.processName:item.prcessName"
        :status="item.status"
      >
        <div slot="description" class="description">
          <span>{{ item.processTypeFroms | getStepPeople }}</span>
          <div class="more" v-if="item.processTypeFroms.length > 2">
            ...
            <strong>更多</strong>
            <div class="dialog">
              <h3>{{item.prcessName}}</h3>
              <p>{{ item.processTypeFroms | getStepPeople('all') }}</p>
            </div>
          </div>
        </div>
      </el-step>
    </el-steps>
  </el-col>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    getActive() {
      const data = [...this.data];
      let activeWait = "",
        activeSuccess = "",
        activeError = "";
      data.forEach((item, index) => {
        if (item.status == "wait") {
          activeWait = index;
        }
        if (item.status == "success") {
          activeSuccess = index;
        }
        if (item.status == "error") {
          activeError = index;
        }
      });
      if (activeWait != "" && activeSuccess == "" && activeError == "") {
        //待审
        return activeWait + 1;
      }

      if (activeWait != "" && activeSuccess != "" && activeError == "") {
        //审核通过(部分通过)
        return activeSuccess + 1;
      }

      if (activeWait == "" && activeSuccess != "" && activeError == "") {
        //审核通过(全部通过)
        return activeSuccess + 1;
      }

      if (activeError != "") {
        //驳回
        return activeError + 1;
      }
    }
  },
  filters: {
    getStepPeople(list, b) {
      let result = [],
        arr = [];
      b === "all" ? (arr = list) : (arr = list.filter((v, i) => i < 2));
      arr.map(v => result.push(v.opreateName ? v.opreateName : v.operateName));
      return result.join("、");
    }
  }
};
</script>

<style lang="stylus" scoped>
.description {
  .more {
    display: inline-block;
    position: relative;
    cursor: pointer;
    z-index: 1000;

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
}
</style>
