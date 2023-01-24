const express = require("express");
const https = require("https");
const path = require("path");

const app = express();
const PORT = "3000";
const {KEY} = require(path.join(__dirname, "secrets.js"));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/", (req, res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };


    const jsonData = JSON.stringify(data);
    const url = `https://us18.api.mailchimp.com/3.0/lists/1b94163134`;
    const options = {
        method: "POST",
        auth: `server:${KEY}`
    };

   
    const apiReq = https.request(url, options, (apiRes) => {
        
        if (apiRes.statusCode == 200) {
            res.sendFile(path.join(__dirname, "sucess.html"));
        }
        else {
            res.sendFile(path.join(__dirname, "failure.html"));
        }
        

        apiRes.on("data", (apiData) => {
            console.log(JSON.parse(apiData));
        });
    });  

    
    apiReq.write(jsonData);
    apiReq.end();

});

