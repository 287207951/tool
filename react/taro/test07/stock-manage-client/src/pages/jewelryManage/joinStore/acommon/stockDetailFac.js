
class StockDetail {
    constructor() {
        this.customeDiscounts = {} // 优惠信息数据
        this.defDiscounts = [] // 杂项的优惠数组
        this.priceAdds = [] // 工费加收优惠信息数组
        this.baseData = {
            weight: 21,
            amount: 12
        } // 页面数据
        this.list = [] // 结费列表
        this.goldPriceList = [] // 金价列表
        this.baseWay = {} // 初始工费
        this.simpleWayData = [] // 转存选项
        this.wayData = [] // 选项
        this.categoryList = [] // 营销品类

        // 默认增加
        this.defObj = {
            feedType: ``,
            ceditWayId: ``,
            ceditWayName: ``,
            ceditProjectId: ``,
            ceditProject: ``,
            ceditWeight: 0,
            ceditPriceG: 0,
            ceditAmount: 0,
            ceditPriceJ: 0,
            ceditMoney: 0,
            ceditNote: ``,
        }

        // 默认退工费
        this.defBackObj = {
            allDisabled: true,
            feedType: ``,
            ceditWayId: 8,
            ceditWayName: `退工费`,
            ceditProjectId: ``,
            ceditProject: ``,
            ceditWeight: 0,
            ceditPriceG: 0,
            ceditAmount: 0,
            ceditPriceJ: 0,
            ceditMoney: 0,
            ceditNote: ``,
        }

        // 增加默认转存
        this.defUnloadObj = {
            ceditWayId: 22,
            ceditWayName: `转存`
        }

        // 增加默认结价
        this.defSurplusObj = {
            ceditWayId: 2,
            ceditWayName: `结价`
        }
    }

    // 初始化优惠信息数据
    initCusTome(options) {
        const { customerDiscountPlats = [], discountProp = [] } = options
        this.customeDiscounts = options
        this.defDiscounts = customerDiscountPlats // 杂项的优惠数组
        this.priceAdds = discountProp // 工费加收优惠信息数组
    }

    // 初始化页面数据
    initBaseData(options) {
        this.baseData = options
        // console.log(this.baseData)
    }

    // 初始化当前金价
    initGoldPrice(options) {
        this.goldPriceList = options
    }

    // 初始化基础工费
    initBaseWay(options) {
        this.baseWay = options
        return this.baseWay
    }

    // 初始化结费列表
    initList(options) {
        this.list = options
        return this.list
    }

    // 转存选项
    initSimpleWayData(options) {
        this.simpleWayData = options.filter(item => {
            return item.ceditWayId == 2 || item.ceditWayId == 22;
        });
        return this.simpleWayData
    }

    // 选项
    initWayData(options) {
        this.wayData = options
        return this.wayData
    }

    // 初始化营销品类
    initCategoryList(options) {
        this.categoryList = options
        return this.categoryList
    }

    // 计算总金额
    countPriceSingle(options) {
        let { ceditPriceG, ceditPriceJ, ceditAmount, ceditWeight } = options
        if (Number(ceditPriceG)) {
            options.ceditMoney = Math.round(ceditPriceG * ceditWeight).toFixed(2);
        }
        if (Number(ceditPriceJ)) {
            options.ceditMoney = Math.round(ceditPriceJ * ceditAmount).toFixed(2);
        }
        if (!Number(ceditPriceG) && !Number(ceditPriceJ)) {
            options.ceditMoney = 0
        }
        return options
    }

    // 计算退工费
    countPriceBackSingle(options) {
        let obj = this.countPriceSingle(options)
        obj.ceditMoney = Math.round(0 - obj.ceditMoney).toFixed(2)
        return obj
    }

    // 计算每一行的金额
    countAll() {
        for (let key in this.list) {
            if (this.list[key].ceditWayId === 8) {
                this.list[key] = this.countPriceBackSingle(this.list[key])
            }
            if (this.list[key].ceditWayId !== 8) {
                this.list[key] = this.countPriceSingle(this.list[key])
            }
        }
    }

    // 处理单价
    hanldPriceSingle(options, feedType) {
        if (feedType === 1) {
            options.row.ceditPriceJ = 0
        }
        if (feedType === 2) {
            options.row.ceditPriceG = 0
        }
        return options
    }

    // 根据项目获取当前的金价
    getProjectGoldPrice(elem) {
        let goldPrice = this.goldPriceList[0].propValue
        // if (elem.ceditWayId == 2 || elem.ceditWayId == 22) {
        //     this.goldPriceList.forEach(item => {
        //         if (item.propType == elem.ceditProject) {
        //             goldPrice = item.propValue;
        //         }
        //     });
        // }
        // console.log(goldPrice)
        return goldPrice;
    }

    // 获取结价工费
    getSurPrice(options) {
        let price = Number(this.baseWay[options.ceditProject]) + Number(this.getProjectGoldPrice(options));
        price = parseFloat(price.toFixed(2))
        return price
    }

    // 获取转存工费
    getUnloadPrice(options) {
        return Number(this.baseWay[options.ceditProject])
    }

    // 判断列表有多少转存
    getUnloadSur() {
        let unload = this.list.filter(item => item.ceditWayId === 22)
        let sur = this.list.filter(item => item.ceditWayId === 2)
        return {
            unload: unload || [],
            sur: sur || []
        }
    }

    // 列表转存状态
    unloadSurLestStatus() {
        const { unload, sur } = this.getUnloadSur()
        if (unload.length === 1 && sur.length === 0) {
            this.list.forEach(item => {
                if (item.ceditWayId === unload[0].ceditWayId) {
                    item.usDisabled = false
                }
            })
        }
        if (unload.length === 0 && sur.length === 1) {
            this.list.forEach(item => {
                if (item.ceditWayId === sur[0].ceditWayId) {
                    item.usDisabled = false
                }
            })
        }
        if (unload.length === 1 && sur.length === 1) {
            this.list.forEach(item => {
                if (item.ceditWayId === unload[0].ceditWayId || item.ceditWayId === sur[0].ceditWayId) {
                    item.usDisabled = true
                }
            })
        }
    }

    // 点击添加
    addFun(elem, index) {
        const { unload, sur } = this.getUnloadSur()
        let rowData = { ...this.defObj }
        // if (unload.length === 1 && sur.length === 1 && (elem.ceditWayId === 2 || elem.ceditWayId === 22)) {
        //     return
        // }
        // if (elem.ceditWayId === 2) {
        //     rowData.ceditWayId = 22;
        //     rowData.ceditWayName = "转存";
        //     rowData.ceditProjectId = elem.ceditProjectId;
        //     rowData.ceditProject = elem.ceditProject;
        //     rowData.feedType = elem.feedType;
        //     rowData.ceditPriceG = this.getUnloadPrice(elem);
        //     rowData.ceditMoney = 0;
        // }
        // if (elem.ceditWayId === 22) {
        //     rowData.ceditWayId = 2;
        //     rowData.ceditWayName = "结价";
        //     rowData.ceditProjectId = elem.ceditProjectId;
        //     rowData.ceditProject = elem.ceditProject;
        //     rowData.feedType = elem.feedType;
        //     rowData.ceditPriceG = this.getSurPrice(elem)
        //     rowData.ceditMoney = 0;
        // }

        // 如果 有杂项优惠 跳过杂项优惠增加一行
        if (this.isBackDiscount(elem, index) || this.isPriceAddBackDiscount(elem, index)) {
            this.list.splice(index + 2, 0, rowData);
        } else {
            this.list.splice(index + 1, 0, rowData);
        }

        this.unloadSurLestStatus()
    }

    deleteFun(options, index) {
        // 如果有绑定退工费删除绑定的退工费
        if (this.isBackDiscount(options, index)) {
            this.list.splice(index + 1, 1)
        }
        this.list.splice(index, 1);
        this.unloadSurLestStatus()
    }


    // 选择事件
    selectWayFun(elem, index) {
        // if (elem.ceditWayId == 2) {
        //     elem.ceditPriceG = this.getSurPrice(elem) || 0;
        //     // elem.ceditMoney = parseInt((elem.ceditWeight * elem.ceditPriceG).toFixed(2));
        //     elem.ceditWayName = "结价";
        // } else if (elem.ceditWayId == 22) {
        //     elem.ceditPriceG = this.getUnloadPrice(elem) || 0;
        //     // elem.ceditMoney = parseInt((elem.ceditWeight * elem.ceditPriceG).toFixed(2));
        //     elem.ceditWayName = "转欠";
        // }
        this.selectWayFunDef(elem, index)
        // this.countAll()
        return elem
    }

    // 获取新增的筛选类型
    getDefObj(options) {
        this.wayData.forEach(item => {
            if (item.ceditWayId === options.ceditWayId) {
                delete options.backId
                options = { ...options, ...item }
            }
        })
        return options
    }

    // 选择事件 
    selectWayFunDef(elem, index) {
        elem = this.getDefObj(elem)
        if (elem.price) {
            if (elem.billingWay === 'k') {
                elem.feedType = 1
                elem.ceditPriceG = elem.price
                elem.ceditPriceJ = 0
            }
            if (elem.billingWay === 'j') {
                elem.feedType = 2
                elem.ceditPriceJ = elem.price
                elem.ceditPriceG = 0
            }
            if (elem.billingWay === 'd') {
                elem.ceditProject = ``
                elem.feedType = 3
                elem.ceditAmount = 1
                elem.ceditPriceJ = elem.price
                elem.ceditPriceG = 0
            }
        }
        this.list.splice(index, 1, elem)
        this.hanldDiscountDef(elem, index)
    }

    // 判断杂项是否有优惠
    isDiscount(options) {
        const { ceditWayId } = options
        return this.defDiscounts.filter(item => item.paypayVal === ceditWayId && item.discountSatue === 'Y').length > 0
    }

    // 判断杂项是否 有已经绑定的退工费
    isBackDiscount(options, index) {
        return this.isDiscount(options) && this.list[index + 1] && this.list[index + 1].ceditWayId === 8 && options.backId && options.backId === this.list[index + 1].backId
    }

    // 判断杂项 没有绑定退工费 但是有退工费
    isBackDiscountTwo(options, index) {
        return this.list[index + 1] && this.list[index + 1].ceditWayId === 8 && !options.backId && this.list[index + 1].backId
    }

    // 判断杂项 有优惠 切换到 有优惠 删除退工费
    isBackDiscountThree(options, index) {
        return this.list[index + 2] && this.list[index + 2].ceditWayId === 8 && this.list[index + 2].backId
    }

    // 获取当前优惠绑定的退工费的对象 和 下标
    getBindBackDiscountDef(options, index) {
        let val = {}, trueIndex = 0
        if (this.isBackDiscount(options, index)) {
            val = this.list[index + 1]
            trueIndex = index + 1
        }
        return {
            val,
            index: trueIndex
        }
    }

    // 判断杂项是否有优惠 如果有杂项有优惠增加一条退工费
    hanldDiscountDef(options, index) {

        // 有优惠 且没有绑定的退工费 增加一条退工费
        if (this.isDiscount(options) && !this.isBackDiscount(options, index)) {
            this.trueDiscountDef(options, index)
        }

        // 无优惠 有绑定的退工费 删除一条退工费
        if (!this.isDiscount(options) && this.isBackDiscountTwo(options, index)) {
            this.list.splice(index + 1, 1)
        }

        // 有优惠 有绑定的退工费 删除一条退工费
        if (this.isDiscount(options) && this.isBackDiscountThree(options, index)) {
            this.list.splice(index + 2, 1)
        }

    }

    // 增加一条退工费
    trueDiscountDef(options, index) {
        const { ceditWayId } = options
        let obj = {}, otherObj = {}
        this.defDiscounts.forEach(item => {
            if (item.paypayVal === ceditWayId && item.discountSatue === 'Y') {
                otherObj = {
                    backId: `def${~~(Math.random() * 10000)}`
                }
                options = { ...options, ...otherObj }
                obj = this.generateBackPrice(item, options, otherObj)
            }
        })
        this.list.splice(index, 1, options)
        this.list.splice(index + 1, 0, obj)
    }

    // 生成退工费 设置退工费属性
    generateBackPrice(item, options, otherObj) {
        const { billingWay } = options
        const { discountPrice } = item
        let priceObj = {}
        if (billingWay === 'k') {
            priceObj = {
                feedType: 1,
                ceditPriceG: discountPrice,
                ceditPriceJ: 0
            }
        }
        if (billingWay === 'j') {
            priceObj = {
                feedType: 2,
                ceditPriceJ: discountPrice,
                ceditPriceG: 0
            }
        }
        if (billingWay === 'd') {
            priceObj = {
                feedType: 3,
                ceditAmount: 1,
                ceditPriceJ: discountPrice,
                ceditPriceG: 0
            }
        }
        return { ...this.defBackObj, ...priceObj, ...otherObj }
    }

    // 退工费联动 arg 传入参数 
    linkBackDiscount(options, ...arg) {
        const { row, $index } = options
        const { val, index } = this.getBindBackDiscountDef(row, $index)
        let obj = {}

        // 如果绑定退工费 将传入的参数绑定到退工费
        if (this.isBackDiscount(row, $index)) {
            for (let item of arg) {
                obj[item] = row[item]
            }
            this.list[index] = { ...val, ...obj }
        }
    }

    // 生成工费加收 退工费 
    generateBackPriceAdd(item, options) {
        const { discountPrice } = item
        let obj = {}, priceObj = {}
        priceObj = {
            ceditWayId: 8,
            ceditWayName: `退工费`,
            ceditPriceG: discountPrice,
        }
        return { ...this.defBackObj, ...options, ...priceObj }
    }


    // 判断列表中是否有工费 加收优惠 返回优惠信息 
    isPriceAddDiscount(options) {
        const { ceditWayId, ceditPriceG } = options
        let obj = {}, flag = true, status = false
        if (!Array.isArray(this.priceAdds) || ceditWayId !== 1 || ceditPriceG === 0) {
            flag = false
        }
        if (flag) {
            this.priceAdds.forEach(item => {
                if (item.minPrice <= ceditPriceG && item.maxPrice >= ceditPriceG) {
                    options.backId = `priceAdd`
                    obj = this.generateBackPriceAdd(item, options)
                    status = true
                }
            })
        }
        return {
            status,
            obj
        }
    }

    // 判断工费加收 是否已经有了绑定的退工费 TODO
    isPriceAddBackDiscount(options, index) {
        return this.list[index + 1] && this.list[index + 1].ceditWayId === 8 && options.backId === this.list[index + 1].backId
    }

    // 判断是否有工费加收 设置工费加收优惠 TODO
    priceAddDiscount() {
        for (let key in this.list) {
            if (this.isPriceAddDiscount(this.list[key]).status && !this.isPriceAddBackDiscount(this.list[key], key - 0)) {
                this.list.splice(key - 0 + 1, 0, this.isPriceAddDiscount(this.list[key]).obj)
            }
        }
    }

    // 改变营销品类名称
    getCateName(options) {
        const { ceditProjectId } = options
        const { categoryList } = this
        let list = categoryList.filter(item => item.id === ceditProjectId)
        options.ceditProject = list.length > 0 ? list[0].name : ''
        console.log(options)
    }

    // 改变营销品类
    changeCate(options) {
        this.getCateName(options.row)
        this.linkBackDiscount(options, `ceditProject`, `ceditProjectId`)
    }

    // 改变单价克
    changePriceK(options) {
        options = this.hanldPriceSingle(options, 1);
        this.priceAddDiscount()
        this.countAll();
    }

    // 改变单价件
    changePriceJ(options) {
        options = this.hanldPriceSingle(options, 2);
        // this.priceAddDiscount()
        this.countAll();
    }

    getToFixed(options) {
        return parseFloat(options).toFixed(2)
    }

    // 转存改变数量
    changeUnloadCount(options) {
        let { row: { ceditWayId, ceditAmount }, $index } = options
        const { baseData: { amount } } = this
        const unloadIndex = this.list.findIndex(item => item.ceditWayId === 2)
        const surIndex = this.list.findIndex(item => item.ceditWayId === 22)
        if (ceditAmount >= amount) {
            this.list[unloadIndex].ceditAmount = amount
        }
        if (ceditAmount <= 0) {
            this.list[unloadIndex].ceditAmount = 0
        }
        if (ceditWayId === 2 && surIndex !== -1) {
            this.list[surIndex].ceditAmount = amount - this.list[unloadIndex].ceditAmount
        }
    }

    // 结价改变数量
    changeSurCount(options) {
        let { row: { ceditWayId, ceditAmount }, $index } = options
        const { baseData: { amount } } = this
        const unloadIndex = this.list.findIndex(item => item.ceditWayId === 2)
        const surIndex = this.list.findIndex(item => item.ceditWayId === 22)
        if (ceditAmount >= amount) {
            this.list[surIndex].ceditAmount = amount
        }
        if (ceditAmount <= 0) {
            this.list[surIndex].ceditAmount = 0
        }
        if (ceditWayId === 22 && unloadIndex !== -1) {
            this.list[unloadIndex].ceditAmount = amount - this.list[surIndex].ceditAmount
        }
    }

    // 改变数量
    changeCount(options) {
        this.linkBackDiscount(options, `ceditAmount`)
        // let { row: { ceditWayId } } = options
        // if (ceditWayId === 2) {
        //     this.changeUnloadCount(options)
        // }
        // if (ceditWayId === 22) {
        //     this.changeSurCount(options)
        // }
        this.countAll()
    }

    // 转存改变克重
    changeUnloadWeight(options) {
        const { row: { ceditWayId, ceditWeight }, $index } = options
        const { baseData: { weight } } = this
        const unloadIndex = this.list.findIndex(item => item.ceditWayId === 2)
        const surIndex = this.list.findIndex(item => item.ceditWayId === 22)
        if (ceditWeight >= weight) {
            this.list[unloadIndex].ceditWeight = weight
        }
        if (ceditWeight <= 0) {
            this.list[unloadIndex].ceditWeight = 0
        }
        if (ceditWayId === 2 && surIndex !== -1) {
            this.list[surIndex].ceditWeight = this.getToFixed(weight - this.list[unloadIndex].ceditWeight)
        }
    }

    // 结价改变克重
    changeSurWeight(options) {
        const { row: { ceditWayId, ceditWeight }, $index } = options
        const { baseData: { weight } } = this
        const unloadIndex = this.list.findIndex(item => item.ceditWayId === 2)
        const surIndex = this.list.findIndex(item => item.ceditWayId === 22)
        if (ceditWeight >= weight) {
            this.list[surIndex].ceditWeight = weight
        }
        if (ceditWeight <= 0) {
            this.list[surIndex].ceditWeight = 0
        }
        if (ceditWayId === 22 && unloadIndex !== -1) {
            this.list[unloadIndex].ceditWeight = this.getToFixed(weight - this.list[surIndex].ceditWeight)
        }
    }

    // 改变重量
    changeWeight(options) {
        this.linkBackDiscount(options, `ceditWeight`)
        // let { row: { ceditWayId } } = options
        // if (ceditWayId === 2) {
        //     this.changeUnloadWeight(options)
        // }
        // if (ceditWayId === 22) {
        //     this.changeSurWeight(options)
        // }
        this.countAll()
    }


    // 判断工费加收是否有退工费 获取工费加收下标 数据
    getAddBackDiscountIndex(options) {
        let arr = [...this.list];
        return arr.findIndex((item, index) => {
            return item.backId && item.backId === options.backId && arr[index - 1] && arr[index - 1].backId === item.backId
        })
    }

    // 判断是否是杂项退工费
    isDefBackDiscount(options, index) {
        return this.list[index - 1] && this.list[index - 1].backId && options.backId === this.list[index - 1].backId
    }

    // 工费加收是否有退工费数据
    generateDicountItemParams(index) {
        let arr = [...this.list];
        arr[index].statue = 2
        return { ...arr[index] }
    }

    // 工费加收退工费改变标识
    changeStatue(index, option) {
        let arr = [...this.list];
        let obj = arr[index]
        obj.statue = option
        this.list.splice(index, 1, { ...obj })
    }

    // 过滤为空参数
    filterAmountNull(options) {
        return options.filter(item => item.ceditAmount)
    }

    // 获取工费加收参数
    getProStockDetailParams() {
        let arr = [...this.list];
        arr = this.filterAmountNull(arr)
        arr.forEach((item, index) => {

            // 如果是普通工费
            if (item.ceditWayId === 8 && this.getAddBackDiscountIndex(item) === -1) {
                console.log(item.ceditWayId === 1, this.getAddBackDiscountIndex(item))
                this.changeStatue(index, 4)
            }

            // 如果是工费加收 退工费
            if (item.ceditWayId === 1 && this.isPriceAddBackDiscount(item, index)) {

                // 工费加收退工费改变标识
                this.changeStatue(index + 1, 3)
                // 工费加收是否有退工费数据
                item.returnoutstoreCeditList = [this.generateDicountItemParams(index + 1)]
            }

            // 如果是杂项退工费
            // if (item.ceditWayId === 8 && this.isDefBackDiscount(item, index)) {
            //     this.changeStatue(index, 4)
            // }

        })
        return arr
    }

    // 获取列表
    getList() {
        return this.list
    }


}

export default StockDetail
