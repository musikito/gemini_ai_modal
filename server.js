const PORT = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const fs = require("fs");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");
let filePath;

app.post("/upload",(req, res) =>{
    upload(req, res,(error) =>{
        if(error){ return res.status(500).json({error: error});}
        filePath = req.file.path;

    });
});




app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
