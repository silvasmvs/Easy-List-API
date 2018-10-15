const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./controllers/userController')(app);
require('./controllers/listController')(app);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port);
