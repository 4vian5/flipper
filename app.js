const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const aes = require('./crypto/aes')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

  app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/static/register.html');
  });

  app.get('/status', (req, res) => {
    res.sendFile(__dirname + '/static/status.html');
  });

  app.post('/register', (req, res) => {
    try{
      const blacklist = ['1', 'admin', 'admin=1', 'admin=0']

      const username = req.body.username

      if(blacklist.some(word => username.includes(word))){
        return res.json({msg: "Please don't hack us. We are a small startup. What did we ever do to you"});
      }

      const password = req.body.password || "password";

      const token = "password="+ password + "&admin=0&user=" + username;

      const encryptedToken = aes.encrypt(token);

      return res.json({token: encryptedToken});
    }
    catch(error){
      return res.json({msg: "Please don't hack us. We are a small startup. What did we ever do to you"});
    }
  });

  app.post('/status', (req, res) => {

    try{
      const {token} = req.body;
      const decryptedToken = aes.decrypt(token);

      console.log(decryptedToken);
      try{
        const tokenParts = decryptedToken.split("&");
        const admin = tokenParts.find(part => part.includes("admin=1"));
        const username = tokenParts.find(part => part.includes("user=")).split("=")[1];
        if(!admin){
          return res.json({msg: "We are reveiwing your request. Please wait for 1-2 business days"});
        }
        else{
          return res.json({msg: "flag{DEMO_FLAG}"});
        }
      }
      catch(error){
        return res.json({msg: "Please don't hack us. We are a small startup. What did we ever do to you"});
      }
    }catch(error){
      return res.json({msg: "Please don't hack us. We are a small startup. What did we ever do to you"});
    }
  });

  const port = 3000

app.listen(port, () => console.log(`This app is listening on port ${port}`));

