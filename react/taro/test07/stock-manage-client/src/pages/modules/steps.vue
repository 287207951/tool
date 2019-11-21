<!--
 * Step步骤条封装
 * @param    {Array}  data    请求参数
 *
 * 示例：
 * <Steps :data="[Array]"></Steps>
 *
 * @date     2019-05-07
 * @author   大雄君。（869594800@qq.com）
-->
<template>
  <el-steps
    :active="getActive"
    class="Steps"
  >
    <el-step
      v-for="(item, index) in getData"
      :key="index"
      :title="item.prcessName"
      :status="item.status"
    >
      <div slot="description" class="description">
        <span>{{ item.processTypeFroms | getStepPeople }}</span>
        <div class="more" v-if="item.processTypeFroms.length > 2">
          ...<strong>更多</strong>
          <div class="dialog">
            <h3>补货人员</h3>
            <p>{{ item.processTypeFroms | getStepPeople('all') }}</p>
          </div>
        </div>
      </div>
    </el-step>
  </el-steps>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    computed: {
      getData () {
        let data = [...this.data];
        // 添加状态
        for ( let i = 0, len = data.length; i < len; i++ ) {
          let v = data[i];
          switch (v.orderStatus) {
            case 1:
              v.status = data[i - 1].orderStatus === 2 ? '"process"' : 'wait';
              break;
            case 2:
              v.status = 'success';
              break;
            case 4:
              v.status = 'error';
              break;
            default:
              v.status = 'wait'
          }
        }
        return data;
      },
      getActive () {
        const data = [...this.data];
        let active = data.length;
        for (let i = 0, len = data.length; i < len; i++) {
          if ( data[i].orderStatus !== 2 ) {
            active = i+1;
            break;
          }
        }
        return active;
      }
    },
    filters: {
      getStepPeople (list, b) {
        let result = [], arr = [];
        b === 'all' ? arr = list : arr = list.filter((v, i) => i < 2);
        arr.map( v => result.push(v.operateName) );
        return result.join('、');
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .description {
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
        left:0;
        top: 100%;
        width: 250px;
        box-sizing: border-box;
        padding: 10px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,.2);
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