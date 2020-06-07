const db = require('mongoose');

try{
     db.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}catch(error){
    handleError(error);
}

module.exports = db;