require("dotenv").config();

const PORT = process.env.PORT;
const mongoUrl = process.env.db_URL;

if(process.env.NODE_ENV === 'test') {
MONGODB_URL = process.env.TEST_MONGODB_URL
}

module.exports = { 
    PORT, 
    mongoUrl 
};