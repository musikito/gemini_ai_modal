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

app.post("/upload", (req, res) => {
  upload(req, res, (error) => {
    if (error) { return res.status(500).json({ error: error }); }
    filePath = req.file.path;

  });
}); // End of upload endpoint



app.post("/analyze", async (req, res) => {
  try {
    function fileToGenerativePart(path, mimeType) {
      return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),//fs.readFileSync(path),
          mimeType,
        }
      }
      // const file = fs.readFileSync(path);
      // const base64 = Buffer.from(file).toString("base64");
      // return {
      //   mimeType,
      //   data: base64,
      // };
    }; // End of fileToGenerativePart function

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = req.body.message;
    // const prompt = "Describe the image in detail.";
    // console.log(prompt);

    const result = await model.generateContent([
      prompt,
      fileToGenerativePart(filePath, "image/jpeg"),
    ]);
    console.log(result.response.candidates[0].content.parts[0].text);
    
    const response = await result.response;
    // const text = response.text;
    const text = response.candidates[0].content.parts[0].text;
    
    res.send(text);

  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: "An error occurred while analyzing the image, Please try again." });

  }
  // const { prompt } = req.body;
  // const response = await genAI.generateText({
  //   model: "models/text-bison-001",
  //   prompt: {
  //     text: `Describe the image in detail. ${prompt}`,
  //   },
  // });
  // res.json(response);
});




app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
