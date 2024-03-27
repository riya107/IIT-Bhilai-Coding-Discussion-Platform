const mongoose= require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async () => {
  try {
    const connectionString = await mongoose.connect(`mongodb+srv://csd:csd@cluster0.aysqpl1.mongodb.net/?retryWrites=true&w=majority`, {
      useUnifiedTopology: true, 
      useNewUrlParser: true,
    });
    console.log(
      
        `\nDB connected: ${connectionString.connection.host}\n`
      );
  } catch (error) {
    console.log(error);
    console.log("\nConnection to link DB failed\n");
  }
};
module.exports=dbConnect;