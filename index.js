const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.status(200).json({messege : "succesfully started server"})
})

app.listen(3000, () => {
    console.log("App is listening on port " + 3000);
})