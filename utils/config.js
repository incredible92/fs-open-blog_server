require("dotenv").config();

const PORT = process.env.PORT || 3031;
let mongoUrl = process.env.db_URL;

if(process.env.NODE_ENV === 'test') {
mongoUrl = process.env.TEST_MONGODB_URL
}

module.exports = { 
    PORT, 
    mongoUrl 
};