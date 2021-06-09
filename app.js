const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Arquivo static
app.use(express.static(path.join(__dirname, 'public')));

// Rota de cadastro
app.post('/signup',(req, res) =>{
    const { firstName, lastName, email} = req.body;

    // Make sure fields are filled
    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }

    // Construct req data

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data);

    const options ={
        url: 'https://us1.api.mailchimp.com/3.0/lists/81e96d5442',
        method: 'POST',
        headers:{
            Authorization: 'auth b9a96cfa03e2985f8568ed6bafdeef38-us1'
        },
        body: postData
    };

    request(options, (err, response, body) =>{
            if(err){
                res.redirect('/fail.html');
            }else{
                if(response.statusCode === 200){
                    res.redirect('/sucess.html');
                }else{
                    res.redirect('/fail.html');
                }
            }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));