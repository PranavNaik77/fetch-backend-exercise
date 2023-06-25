const { v4: uuidv4 } = require('uuid');
const { rule1, rule2, rule3, rule4, rule5, rule6, rule7 } = require("../utility/rules");
const { createError } = require("../utility/error");

const map = new Map();

const isValidDate = (d) => {
    var date = new Date(d);
    return date instanceof Date && !isNaN(date.valueOf());     
}

const isValidTime = (time) => {
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    return hour<24 && minute<60;
}

const calculatePoints = (receipt) => {

    let points = 0;
    let error;
    
    // Rule-1
    if (receipt.retailer){
        points = points + rule1(receipt.retailer);   
    }
    else{
        error = createError(500, "Invalid retailor name");
    }

    // Rule-2 and Rule-3
    if (receipt.total) {
        points = rule2(receipt.total) ? points + 50 : points;
        points = rule3(receipt.total) ? points + 25 : points;
    }
    else{
        error = createError(500, "Invalid amount");
    }

    // Rule-4 and Rule-5
    if (receipt.items) {
        points = points + rule4(receipt.items.length);
        points = points + rule5(receipt.items);
    }
    else{
        error = createError(500, "Invalid items");
    }

    // Rule-6 
    if (receipt.purchaseDate && isValidDate(receipt.purchaseDate))
        points = rule6(receipt.purchaseDate) ? points + 6 : points;
    else{
        error = createError(500, "Invalid purchase date");
    }

    // Rule-7
    if (receipt.purchaseTime && isValidTime(receipt.purchaseTime))
        points = rule7(receipt.purchaseTime) ? points + 10 : points;
    else{
        error = createError(500, "Invalid purchase time");
    }

    return {points,error};
};

exports.processReceipt = (req,res,next) => {
    
    const receipt = req.body;

    const {points, error} = calculatePoints(receipt);

    if(error){
        return next(error);
    }

    const newId = uuidv4();
    map.set(newId, points);
    res.status(200).json({ id: newId });
};

exports.getPoints = (req,res,next) => {
    const id = req.params.id;
    if(!map.get(id)){
        return next(createError(500, "ID not found"));
    }
    res.status(200).json({
        points: map.get(id)
    })
};