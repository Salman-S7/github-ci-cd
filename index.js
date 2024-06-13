const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.status(200).json({messege : "Hello how are you???"})
})

app.listen(3000, () => {
    console.log("App is listening on port " + 3000);
})