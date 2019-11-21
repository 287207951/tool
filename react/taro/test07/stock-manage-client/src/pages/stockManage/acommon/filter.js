import $api from '$pRootUtils/api'
class orderFun {
  constructor() {
    this.dataSource = []
    this.dataSourceAddr = []
    this.result = {}
  }
  //收货单单品和套装合并
  setDatasource(orderData) {
    this.result = orderData
    var newList = this.result.receiptOrderProducts.concat(this.result.receiptSuitOrderFroms);
    newList.forEach(ielem=>{
      if(ielem.transfOrderProducts && ielem.transfOrderProducts.length > 0){
        ielem.suitTF = true;
      }else{
        ielem.suitTF = false;
      }
      ielem.editOriSkuSum = ielem.oriSkuSum
      ielem.oriSkuSumOne = ielem.oriSkuSum
      if(ielem.extendAttr){
        ielem.sizeData = JSON.parse(ielem.extendAttr)
      }
      if(ielem.suitTF){
        ielem.standardGold = ielem.skuWeight
        // ielem.skuWeight = $api.returnFloat(ielem.skuSum * ielem.skuWeight)
        ielem.editSkuWeight = ielem.goldWeight
        ielem.editSkuGoldWeight = ielem.editSkuWeight
      }else{
        // ielem.skuWeight = $api.returnFloat(ielem.skuSum * ielem.standardGold)
        ielem.editSkuWeight = ielem.goldWeight
        ielem.editSkuGoldWeight = ielem.editSkuWeight
      }
      ielem.editSkuSum = ielem.skuSum
    })
    this.result.receiptOrderProducts = newList
    if(this.result.receiptPacks){
      this.result.receiptPacks.forEach(jelem=>{
        var newListTwo = jelem.receiptOrderProducts.concat(jelem.receiptSuitOrderFroms);
        newListTwo.forEach(ielem=>{
          if(ielem.transfOrderProducts && ielem.transfOrderProducts.length > 0){
            ielem.suitTF = true;
          }else{
            ielem.suitTF = false;
          }
          ielem.editOriSkuSum = ielem.oriSkuSum
          ielem.oriSkuSumOne = ielem.oriSkuSum
          if(ielem.extendAttr){
            ielem.sizeData = JSON.parse(ielem.extendAttr)
          }
          if(ielem.suitTF){
            ielem.editSkuWeight= ielem.goldWeight?ielem.goldWeight:0
            ielem.standardGold = ielem.skuWeight
            // ielem.skuWeight = $api.returnFloat(ielem.skuSum * ielem.editSkuWeight)
            ielem.editSkuWeight = ielem.goldWeight
            ielem.editSkuGoldWeight = ielem.editSkuWeight
          }else{
            ielem.skuWeight = ielem.standardGold?$api.returnFloat(ielem.skuSum * ielem.standardGold):0
            ielem.editSkuWeight = ielem.skuWeight
            ielem.editSkuGoldWeight = ielem.editSkuWeight
          }
          ielem.editSkuSum = ielem.skuSum
        })
        // console.log(newListTwo)
        jelem.receiptOrderProducts = newListTwo
      })
    }else{
      this.result.receiptPacks=[]
    }
    return this.result
  }
}

export default new orderFun()
