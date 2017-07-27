'use strict';
/*
* 打印收据
* @param carItems [Object] 购物车Car中的商品
* */
function printReceipt(carItems){
  
}

/*
* 格式化购物车中商品
* @param carItems [Object] 购物车Car中的商品
* @param allItems　[Object] 全部商品
* */
function formatCarItems(carItems, allItems) {
  let formatItems = [];
  carItems.forEach(item => {
    let items = {};
    items.barcode = item.split('-')[0]; // 条码
    items.num = item.split('-')[1] - 0;　// 购买数量
    let itemInfo = allItems.filter(a => {
      return a.barcode === items.barcode;
    }); // 当前商品的全部信息
    items.name = itemInfo[0].name; // 名称
    items.price = itemInfo[0].price; // 单价
    items.unit = itemInfo[0].unit; // 单位
    formatItems.push(items);
  })
  return formatItems;
}

// console.log(formatCarItems(tags, loadAllItems()));
