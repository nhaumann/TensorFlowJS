import dotenv from "dotenv";
import fs from "fs";

export const LoadSecrets = () =>{
    if (fs.existsSync(".env")) {
        console.log("Using .env file to supply config environment variables.");
        dotenv.config({ path: ".env" });
    } else {
        console.log("Using .env.default file to supply default config environment variables.\nTo use custom environment variables, create a .env file of your own. This will be ignored by git.");
        dotenv.config({ path: ".env.default" });  // you can delete this after you create your own .env file!
    }
    dotenv.config({ path: ".env.shared" });
}
