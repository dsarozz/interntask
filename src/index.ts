import app from './app';
import * as config from './config';
import { connection } from './dbConnection';

app.listen(config.port, function () {
    console.log('Server is running in port :' + config.port);
});

try {
    connection.authenticate();
    console.log('Connection successful to :' + config.dbName);
} catch (error) {
    console.log('Connection failed due to: ' + error);
}