const express = require('express');
const app=express();

app.use((req,res,next)=>{
res.send('hello form the server');


})

app.listen(3000,()=>{
    console.log('server is successfully listening on port 3000')
});
