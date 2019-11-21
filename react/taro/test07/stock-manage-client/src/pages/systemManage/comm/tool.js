import Api from '@/skyConfig/_api';

export default {
  // 获取任务列表
  getTaskList() {
    return new Promise(resolve => {
      const list = sessionStorage.getItem('taskNameList');
      if (list) {
        resolve(JSON.parse(list));
      } else {
        Api.get({ url: '/task/oneTimeTaskNameList' })
          .then(({ data }) => {
            sessionStorage.setItem('taskNameList', JSON.stringify(data));
            resolve(data);
          })
      }
    })
  },
  // 获取定时任务名称列表
  getTaskTimeingList() {
    return new Promise(resolve => {
      const list = sessionStorage.getItem('taskTimeNameList');
      if (list) {
        resolve(JSON.parse(list));
      } else {
        Api.get({ url: '/task/nameList' })
          .then(({ data }) => {
            sessionStorage.setItem('taskTimeNameList', JSON.stringify(data));
            resolve(data);
          })
      }
    })
  },
  // 根据传递的任务名称获取任务描述
  getTaskNames (taskName) {
    return new Promise((resolve, reject) => {
      typeof taskName !== 'string' && reject({ errMsg: '参数有误，请传递字符串参数!' });

      this.getTaskList()
      .then(list => {
        list.map(v => v.taskName === taskName && resolve(v.taskDesc));
        resolve(taskName);
      })
    })
  }
}