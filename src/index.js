const { app, port } = require("./config");
const { processReceipt, getPoints } = require("./api/endpoints");

app.listen(port, () => {
    console.log("-------------------------------");
    console.log(`Backend Service ready to be used at port: ${port}`);
    console.log(`URL: http://localhost:${port}`);
    console.log("-------------------------------");
});

//get id of the receipt
app.post("/receipts/process", processReceipt);

//get points of the receipt
app.get("/receipts/:id/points", getPoints);

app.use((err,req,res,next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "something went wrong";
    return res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMessage,
      stack: err.stack
    });
  })

