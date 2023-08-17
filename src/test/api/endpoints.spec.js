const axios = require('axios');
const appHost = process.env.APP_HOST || 'localhost';

describe('Process Receipts API for valid data', () => {
    let receiptId = "";
    test('POST /receipts/process returns a JSON object with an ID', async () => {
        const receipt = {
            "retailer": "Target",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
            {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
            },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
            },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
            },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
            },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
            }
            ],
            "total": "35.35"
        };

        const response = await axios.post(`http://${appHost}:8800/receipts/process`, receipt);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id');
        receiptId = response.data.id;
    });

    test('GET /receipts/{id}/points returns a JSON object with the number of points awarded', async () => {

        const response = await axios.get(`http://${appHost}:8800/receipts/${receiptId}/points`);

        expect(response.status).toBe(200);
        expect(response.data).toEqual({ "points" : 28 });
    });
});

describe('Process Receipts API for Invalid data', () => {
    test('POST /receipts/process returns a JSON object with an No ratialer name error', async () => {
        // data with no retailer
        const receipt = {
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
            {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
            },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
            },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
            },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
            },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
            }
            ],
            "total": "35.35"
        };

        try {
            await axios.post(`http://${appHost}:8800/receipts/process`, receipt);
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.message).toBe("No retailer name found");
        }
    });

    test('POST /receipts/process returns a JSON object with an Invalid purchase date error', async () => {
        // data with Invalid date
        const receipt = {
            "retailer": "Target",
            "purchaseDate": "2022-13-32",
            "purchaseTime": "13:01",
            "items": [
            {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
            },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
            },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
            },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
            },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
            }
            ],
            "total": "35.35"
        };

        try {
            await axios.post(`http://${appHost}:8800/receipts/process`, receipt);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe("Invalid purchase date");
        }
    });

});
