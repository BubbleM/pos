'use strict';

/*
* 打印收据
* @param carItems [Object] 购物车Car中的商品
* */
function printReceipt(carItems){
  
}

/*
 * 根据条码查找当前商品是否在对象数组中
 * @param code 条码
 * @param arr [Objcet]　
 * */
function findBarcode(code, arr) {
  var result = false;
  arr.forEach(item => {
    if(item.barcode === code){
      result = true;
    }
  });
  return result;
}

/*
 * 合并重复商品
 * @param items 合并商品列表中重复商品
 * */
function mergeRepeatItem(items) {
  let arr = [];
  items.forEach(item => {
    if(findBarcode(item.barcode, arr)) {
      for(let i = 0; i < arr.length; i++){
        if(arr[i].barcode === item.barcode) arr[i].num += item.num;
      }
    }else{
      arr.push(item);
    }
  });
  return arr;
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
    let num = item.split('-')[1] - 0;　// 购买数量
    if(num){
      items.num = num;
    }else{
      items.num = 1;
    }
    let itemInfo = allItems.filter(a => {
      return a.barcode === items.barcode;
    }); // 当前商品的全部信息
    items.name = itemInfo[0].name; // 名称
    items.price = itemInfo[0].price; // 单价
    items.unit = itemInfo[0].unit; // 单位
    formatItems.push(items);
  })
  return  mergeRepeatItem(formatItems);
}

// console.log(formatCarItems(tags, loadAllItems()));

