const express = require('express');
const path = require('path');
//creation of application
const app = express();
const PORT = 443;
//Api call to my monogo Db collection using axios
var axios = require('axios');
const { get } = require('express/lib/response');
var data = JSON.stringify({
    "collection": "empData",
    "database": "employeeData",
    "dataSource": "myDb",
    // "projection": {
    //     "_id": 5
    // }
});
            
var config = {
    method: 'post',
    url: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-uchgh/endpoint/data/v1/action/find',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': 'WIfyTJiPhlQbSn0AemoiMEhNA1A1eYZPHtsRDwRYVc2xDIVE7fvK7qoVuBIWMdt1',
      'Accept': 'application/ejson'
    },
    data: data
};
//creating data variable for collecting api data
let apiData={n:"askd"};            
axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        apiData=response.data;
    })
    .catch(function (error) {
        console.log(error);
    });

//setting values of view for the pug engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

let loginCode=0;

//body parser for getting user values
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


//index file
app.get('/', (req, res)=>{
    console.log("port is started")
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

//login page post request
app.post('/login', (req, res) => {
    // Insert Login Code Here
    let username = req.body.userName;
    let password = req.body.password;
    
    if(username=="admin" && password=="12345"){
        res.redirect('/successfull');
        loginCode=1;
    }
    else{
        res.send("Wrong password and userName");
        loginCode=0;
        
    }
  });

app.get('/successfull', (req, res)=>{
    console.log("Login Successfull")
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname,'/public/Successfull.html'));
});
app.get('/employeeData', (req, res)=>{
    if(loginCode===1){
    res.render("employeeData",{'employeeData':apiData.documents});
    console.log(apiData);
}
else{
    res.send("FIrst Login then come again")
}
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);