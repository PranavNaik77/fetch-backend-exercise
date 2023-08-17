const getRetailerNameLengthPoints = (receipt) => {
    var regex = /^[0-9a-zA-Z]+$/;
    var length=0;
    for (var i = 0; i < receipt.retailer.length; i++) {
        if(receipt.retailer.charAt(i).match(regex)){
            length++
        };
      }
    return length;    
};

const getReceiptTotalAmountPoints = (receipt) => {
    var points = 0;
    if((receipt.total - Math.floor(receipt.total)) == 0)
        points += 50;
    if(receipt.total % 0.25==0)
        points += 25;
    return points;
};

const getReceiptItemLengthPoints = (receipt) => {
    return Math.floor(receipt.items.length / 2) * 5;
};

const getRetailerItemDescriptionPoints = (receipt) => {
    var points = 0
    receipt.items.forEach(element => {
        descriptionLength = element.shortDescription.trim().length;
        if(descriptionLength%3==0)
            points = points + Math.ceil(element.price*0.2);
    });
    return points;
};

const getReceiptPurchaseDatePoints = (receipt) => {
    const purchaseDate = receipt.purchaseDate.split("-");
    if(purchaseDate[2]%2 != 0)
        return 6;
    return 0;
};

const getReceiptPurchaseTimePoints = (receipt) => {
    const hour = receipt.purchaseTime.split(":");
    if(hour[0]>14 && hour[0]<16)
        return 10;
    return 0;    
};

  module.exports={
    getRetailerNameLengthPoints,
    getReceiptTotalAmountPoints,
    getReceiptItemLengthPoints,
    getRetailerItemDescriptionPoints,
    getReceiptPurchaseDatePoints,
    getReceiptPurchaseTimePoints
}