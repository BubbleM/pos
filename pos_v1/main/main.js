'use strict';
function loadAllItems() {
  return [
    {
      barcode: 'ITEM000000',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000004',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
}

function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ];
}
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

/*
* 返回打折信息里买二送一活动的商品数组
* 
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
          let countNum = Math.floor(formatItems[i].num / 2);
          formatItems[i].discount = countNum * formatItems[i].price;
        }
      }
    }
  });
  return formatItems;
}

const tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];

let formatCarItem = formatCarItems(tags, loadAllItems()); // 格式化后购物车里的商品
let counts = countItems('BUY_TWO_GET_ONE_FREE', loadPromotions()); // 获得参与打折的商品数组
let result = discountItems(formatCarItem, counts);
console.log(result);