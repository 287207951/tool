    //处理引用单据号返回的产品数据数据
    var assemblyProductsData = function(data) {
        let newData = [];
        if (data.length < 0 || data == undefined) {
            return;
        }
        // newData = JSON.parse(JSON.stringify(data));
        newData = data
        newData.forEach(item => {
            let proList = [];
            if (
                item.proSpecData.ProList != undefined &&
                item.proSpecData.ProList.length > 0
            ) {
                proList = item.proSpecData.ProList;
                item.map = {
                    proList
                }
            }

            Object.assign(item, item.proBasics, item.proSpecData);
            item.proNumber = item.skuId;
            item.checked = false;
        });
        return newData;
    };


    export {
        assemblyProductsData
    }