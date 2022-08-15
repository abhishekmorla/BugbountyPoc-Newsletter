const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// change accordingly
// const key = "";
// const api = "";
const bodyParser = require("body-parser");


const request = require("request");
const https = require('https');
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



app.get("/" , function(req , res){
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req,res){
    const email = req.body.variableforbackend; // email from frontend
    
    console.log(email)

    // created object aligned with the api
    const data = {
        members: [
            {
                email_address:email,
                status: "subscribed"
            }
        ]
    };
    
    // converted to json string
    const jsondata= JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/"+key+"";
    
    // the post request we will send to the url
    const options = {
        method: "POST",
        auth: `abhishekmorla:${api}`
    }

    // for sending request 
    const requests = https.request(url , options , function(response){

        // if(response.statusCode === 401)
        // {
        //     return res.status(200).sendFile(__dirname + "/success.html");
        // }
        
        response.on("data" , function(data){
            const respo = JSON.parse(data);
            console.log(respo);
            if(respo.new_members.length === 0)
            {
                const err = respo.errors[0].error;
                const print = err.split(',')[0];
                res.status(404).render(__dirname + "/failure.html", {print:print});
            }
            else{
                res.status(200).sendFile(__dirname + "/success.html");
            }
            
        })

    })

    requests.write(jsondata)
    requests.end();


})

app.post("/failure",function(req , res){
    res.redirect("/");
})

// dynamically port , procfile
app.listen(process.env.PORT || 1337, function(){
    console.log("Started eh?");
})

