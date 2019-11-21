const state = {
    propsData: {
        currentPage: 1
    }
  }
  
  // getters
  const getters = {

  }
  
  // actions
  const actions = {
      
  }
  
  // mutations
  const mutations = {
    saveData(state, payload) {
        state.propsData = payload.propsData
    }
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }