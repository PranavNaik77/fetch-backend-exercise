const { v4: uuidv4 } = require('uuid');
const utilityRules = require("../utility/rules");
const { createError } = require("../utility/error");

const map = new Map();
const { getRetailerNameLengthPoints, 
        getReceiptTotalAmountPoints, 
        getReceiptItemLengthPoints, 
        getRetailerItemDescriptionPoints, 
        getReceiptPurchaseDatePoints, 
        getReceiptPurchaseTimePoints } = utilityRules;

const errorMessages = new Map([
    ["retailer", "No retailer name found"],
    ["total", "No retailer total found"],
    ["items", "No retailer item found"],
    ["purchaseDate", "No purchase date found"],
    ["purchaseTime", "No purchase time found"],
    ["invalidDate", "Invalid purchase date"],
    ["invalidTime", "Invalid purchase time found"],
]);

const isValidDate = (d) => {
    var date = new Date(d);
    return date instanceof Date && !isNaN(date.valueOf());     
}

const isValidTime = (time) => {
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    return hour<24 && minute<60;
}

const validateReceipt = (receipt) => {

    for (const field of ["retailer", "total", "items", "purchaseDate", "purchaseTime"]){
        if (!receipt[field]){
            return createError(404, errorMessages.get(field));
        }
    }

    if (!isValidDate(receipt.purchaseDate)) {
        return createError(400, errorMessages.get("invalidDate"));
    }

    if (!isValidTime(receipt.purchaseTime)) {
        return createError(400, errorMessages.get("invalidTime"));
    }

    return null;
}

const getTotalPoints = (receipt) => {
    
    let points = 0;

    points += getRetailerNameLengthPoints(receipt);   
    points += getReceiptTotalAmountPoints(receipt);
    points += getReceiptItemLengthPoints(receipt);
    points += getRetailerItemDescriptionPoints(receipt);
    points += getReceiptPurchaseDatePoints(receipt);
    points += getReceiptPurchaseTimePoints(receipt);

    return points;
}

exports.processReceipt = (req,res,next) => {
    
    const receipt = req.body;

    error = validateReceipt(receipt);

    if(error != null){
        return next(error);
    }

    const points = getTotalPoints(receipt);

    const newId = uuidv4();
    map.set(newId, points);
    res.status(200).json({ id: newId });
};

exports.getPoints = (req,res,next) => {
    const id = req.params.id;
    if(!map.get(id)){
        return next(createError(404, "ID not found"));
    }
    res.status(200).json({
        points: map.get(id)
    })
};