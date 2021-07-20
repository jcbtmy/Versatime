const mongoose = require("mongoose");

const MONGOURI = "mongodb://mongo:27017/site";

const mongodbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
}


const InitiateMongoServer = async () => {
	
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
