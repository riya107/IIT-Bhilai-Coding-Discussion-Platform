const mongoose= require("mongoose");

const dbConnect = async () => {
  try {
    const connectionString = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
        `\nDB connected: ${connectionString.connection.host}\n`
      );
  } catch (error) {
    console.log(error);
    console.log("\nConnection to link DB failed\n");
  }
};
module.exports=dbConnect;