const stations = require('../data/stations.json');
const connectDB = require('../config/database');
const Station = require('../models/stationModel');
const dotenv = require('dotenv');
const path = require('path');

// configure .env 
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env')});
connectDB();

const importData = async () => {
    try{
        await Station.deleteMany();
        console.log('Stations deleted successfully');
        
        await Station.insertMany(stations);
        console.log('Stations inserted successfully');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

importData();