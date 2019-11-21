const state = {
    activeName: ''
}

// getters
const getters = {}

// actions
const actions = {


}

// mutations
const mutations = {
    changaActiveName(state, value) {
        state.activeName = value;
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}