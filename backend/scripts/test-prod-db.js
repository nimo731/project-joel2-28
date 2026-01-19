const mongoose = require('mongoose');

// The production URI you provided
const uri = "mongodb+srv://patiencekaranjah_db_user:ru3un5flDGPIvxt8@cluster0.wnvkiwo.mongodb.net/joel228generation?retryWrites=true&w=majority&appName=Cluster0";

console.log("Testing connection to MongoDB Atlas...");
console.log("URI:", uri.replace(/:([^@]+)@/, ':****@')); // Hide password in log

mongoose.connect(uri)
    .then(() => {
        console.log("✅ SUCCESS! Connected to MongoDB Atlas successfully.");
        console.log("The credentials and cluster are correct.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ CONNECTION FAILED:");
        console.error(err.message);
        console.log("\nPossible causes:");
        console.log("1. Password is incorrect.");
        console.log("2. IP Address is still blocked (Check Network Access in Atlas).");
        console.log("3. Database user does not have permission.");
        process.exit(1);
    });
