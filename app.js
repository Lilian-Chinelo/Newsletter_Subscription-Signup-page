const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require("inspector");
const { post } = require("request");


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")); //specifies a static folder with files used in the project

app.get("/", function(req , res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const FirstName = req.body.firstName;
    const LastName = req.body.lastName;
    const Email = req.body.email;

    const data = {
        members: [          //The process for parsing data correctly to mailchimp
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

    const url = "https://us6.api.mailchimp.com/3.0/lists/64687fc0e0"; //mailchimp list ID at the end of the end point + list

    const options = {
        method: "POST",
        auth: "LilianU:58d8b69e1d474687c696a8aac16b34f6-us6" //API Key + username for authentication
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html"); //sends the sucess page to the user

        } else{
           res.sendFile(__dirname + "/failure.html"); //sends the failure page to the user
        }
        response.on("data", function(data){
            console.log(JSON.parse(data)); //parse data as Json file
        })
    })

    request.write(jsonData);
    request.end(); //indicates end of request

    app.post("/failure", function(req , res){
        res.redirect("/"); //redirects the user to the home root to try again
    })
});



app.listen(process.env.PORT || 3000, function(req , res){ //the process.env.PORT allows the host server to auto asign a port. 3000 allows for local listening still if needed.
    console.log("Serve is now running on port 3000");
});