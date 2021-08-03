const mongoose = require("mongoose");

const mongodbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
}


const InitiateMongoServer = async (db_host) => {
	
	const MONGOURI = `mongodb://${db_host}:27017/site`;

	try {
		await mongoose.connect(MONGOURI, mongodbOptions);
		console.log("Connected To Mongodb");
		return true;
	} catch(e) {
		console.log(e);
		return null;
	}

}


module.exports = InitiateMongoServer;
