import $utils from '@/skyConfig/libs/utils.js'

class orderCount {
    constructor() {
        this.obj = {}
        this.feeTypeObj = {
            1: '每克',
            2: '每件',
            3: '一口价'
        }
    }


    // 计算方法
    countAll() {
        const { obj } = this
        obj.factoryProductFroms.forEach(item => {
            item.allWeight = 0
            item.allSum = 0
            if (item.orderProperties) {
                item.orderProperties.forEach(it => {
                    it.allWeight = 0
                    it.allSum = 0
                })
            }
            if (item.suitProductFroms) {
                item.suitProductFroms.forEach(it => {
                    it.allWeight = 0
                });
            }
        })

        obj.factoryProductFroms.forEach(item => {
            item.allWeight = 0
            item.allSum = 0
            if (item.orderProperties) {
                item.orderProperties.forEach(it => {
                    it.allWeight = 0
                    it.allSum = 0
                    it.orderPeoductPerties.forEach(iit => {
                        it.allWeight += iit.standardGold * iit.orderSum
                        it.allSum += iit.orderSum
                    })
                })
            }
            if (item.suitProductFroms) {
                item.suitProductFroms.forEach(it => {
                    it.suitProdctPeyFroms.forEach(iit => {
                        it.allWeight += iit.standardGold
                    })
                });
            }
        })

        obj.factoryProductFroms.forEach(item => {
                item.allWeight = 0
                item.allSum = 0
                if (item.orderProperties) {
                    item.orderProperties.forEach(it => {
                        item.allWeight += it.allWeight
                        item.allSum += it.allSum
                    })
                }
                if (item.suitProductFroms) {
                    item.suitProductFroms.forEach(it => {
                        it.allWeight = it.allWeight * it.suitSum
                        item.allWeight += it.allWeight
                    });
                }
            })
            // console.log(obj)
        this.obj = obj
    }

    // 改变格式
    changeFormat() {
        const { obj } = this
        obj.factoryProductFroms.forEach(iitem => {
            iitem.orderProperties.forEach(item => {
                item.productImg = item.productImg.split(',')
                item.productPey = item.productPey.split('_').join('、')
                item.productPey = $utils.changeItemSpec(item.productPey)
                item.checked = false
                item.styleKey = {}
                item.orderPeoductPerties.forEach(it => {
                    it.checked = false
                    it.allWeight = Number(it.standardGold) * Number(it.orderSum)
                        // 尚臻品 计算单个产品附加属性  extendAttr
                    it.extendAttr = it.extendAttr ? JSON.parse(it.extendAttr) : {}
                    it.styleItem = { name: '', value: '' }
                    if (it.extendAttr.length) {
                        let lengthStart, lengthEnd
                        item.styleKey = { name: '长度' }
                        if (it.extendAttr.lengthStart) {
                            lengthStart = it.extendAttr.lengthStart
                        }
                        if (it.extendAttr.lengthEnd) {
                            lengthEnd = it.extendAttr.lengthEnd
                        }
                        it.styleItem = { name: '长度', value: `${lengthStart}-${lengthEnd}` }
                    }
                    if (it.extendAttr.diameterLength) {
                        item.styleKey = { name: '圈口' }
                        it.styleItem = { name: '圈口', value: it.extendAttr.diameterLength }
                    }
                    if (it.extendAttr.ringHand) {
                        item.styleKey = { name: '手寸' }
                        it.styleItem = { name: '圈口', value: it.extendAttr.ringHand }
                    }
                    it.fee = this.feeTypeObj[it.feeType]
                })
            })

            //  套装里面的产品
            if (iitem.suitProductFroms) {
                iitem.suitProductFroms.forEach(it => {
                    it.suitProdctPeyFroms.forEach(iit => {
                        it.styleKey = {}
                        iit.fee = this.feeTypeObj[iit.feeType]
                        iit.extendAttr = iit.extendAttr ? JSON.parse(iit.extendAttr) : {}
                        if (iit.extendAttr.length) {
                            let lengthStart, lengthEnd
                            it.styleKey = { name: '长度' }
                            if (iit.extendAttr.lengthStart) {
                                lengthStart = iit.extendAttr.lengthStart
                            }
                            if (iit.extendAttr.lengthEnd) {
                                lengthEnd = iit.extendAttr.lengthEnd
                            }
                            iit.styleItem = { name: '长度', value: `${lengthStart}-${lengthEnd}` }
                        }
                        if (iit.extendAttr.diameterLength) {
                            it.styleKey = { name: '圈口' }
                            iit.styleItem = { name: '圈口', value: iit.extendAttr.diameterLength }
                        }
                        if (iit.extendAttr.ringHand) {
                            it.styleKey = { name: '手寸' }
                            iit.styleItem = { name: '圈口', value: iit.extendAttr.ringHand }
                        }
                    })
                })
            }
        })
        this.obj = obj
    }

    hanldStep() {
        const { obj } = this
        let stepAc = "";
        if (!obj.perFroms) {
            obj.perFroms = [];
        }
        for (var i = 0; i < obj.perFroms.length; i++) {
            if (obj.perFroms[i].orderStatus === 1) {
                stepAc = i + 1;
                break;
            }
        }
        if (stepAc) {
            this.stepsActive = stepAc;
        } else {
            this.stepsActive = obj.perFroms.length + 1;
        }
        obj.perFroms.unshift({
            prcessName: "客户",
            step: 1,
            orderStatus: 1,
            processTypeFroms: [{
                operateName: obj.userName
            }]
        });
        this.obj = obj
    }

    setList(obj) {
        this.obj = obj
    }

    // 获取列表
    getlist() {
        return this.obj
    }
}

export default new orderCount()