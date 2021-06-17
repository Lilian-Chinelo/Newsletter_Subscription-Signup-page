const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require("inspector");
const { post } = require("request");


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req , res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const FirstName = req.body.firstName;
    const LastName = req.body.lastName;
    const Email = req.body.email;

    const data = {
        members: [          
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/64687fc0e0";
        method: "POST",
        auth: "LilianU:APIKey"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");

        } else{
           res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

    app.post("/failure", function(req , res){
        res.redirect("/");
    })
});



app.listen(process.env.PORT || 3000, function(req , res){
    console.log("Serve is now running on port 3000");
});
