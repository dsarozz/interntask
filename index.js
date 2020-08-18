const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

app.listen(port, function () {
    console.log('Server is running in port :' + port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./router/router'));