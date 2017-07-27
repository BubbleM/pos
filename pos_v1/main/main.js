'use strict';

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

/*
* 返回打折信息里买二送一活动的商品数组
* */
function countItems(info, discounts) {
  let arr = [];
  discounts.forEach(item => {
    if(item.type === info) arr = item.barcodes;
  });
  return arr;
}

/*
* 返回打折后的数据view model
* @param formatItems [Object] 格式化后的购物车中的商品数组
* @param discounts [String] 参与打折活动的商品数组　countItems(info, discounts)获得
* */
function discountItems(formatItems, discounts) {
  discounts.forEach(item => {
    if(findBarcode(item, formatItems)) {
      for(let i = 0; i < formatItems.length; i++){
        formatItems[i].totalPrice = formatItems[i].num * formatItems[i].price;
        if(formatItems[i].barcode === item){
          let countNum = Math.floor(formatItems[i].num / 3);
          formatItems[i].discount = countNum * formatItems[i].price;
        }
      }
    }
  });
  return formatItems;
}


/*
* 获取折扣后的总价和节省价格
* @param discountItem [Object] 打折后的商品数组
* */
function getPrice(discountItem) {
  let price = {
    totalPrice: 0,　// 总共价格
    savePrice: 0 // 节省价格
  }
  discountItem.forEach(item => {
    if(!item.discount) item.discount = 0;
    price.totalPrice += item.totalPrice - item.discount;
    if(item.discount) price.savePrice += item.discount;
  });
  return price;
}

/*
* 打印函数
* @param arrItems [Objcet] 最后格式化的商品信息数组
* @param price [Object] 价格数组
* */
function prints(arrItems, price) {
  let str = '***<没钱赚商店>收据***';
  arrItems.forEach(item => {
    if(!item.discount) item.discount = 0;
    str += '\n名称：'+item.name+'，数量：'+item.num+ item.unit + "，单价："+(item.price).toFixed(2)+'(元)，小计：'+(item.totalPrice-item.discount).toFixed(2)+"(元)";
  });
  str += '\n----------------------';
  str += '\n总计：' + price.totalPrice.toFixed(2) + '(元)' +'\n节省：' + price.savePrice.toFixed(2) + '(元)';
  str += '\n**********************';
  return str;
}

/*
 * 打印收据
 * @param carItems [Object] 购物车Car中的商品
 * */
function printReceipt(tags){
  let formatCarItem = formatCarItems(tags, loadAllItems()); // 格式化后购物车里的商品
  let counts = countItems('BUY_TWO_GET_ONE_FREE', loadPromotions()); // 获得参与打折的商品数组
  let result = discountItems(formatCarItem, counts);
  let prices = getPrice(result);
  let str = prints(result, prices);
  console.log(str);
}
