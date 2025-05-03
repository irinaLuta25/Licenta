require('dotenv').config();

const express=require('express')
const multer=require("multer")
const cors=require("cors")

const app=express()
const port=4848

const {db}=require("./models")
const router=require("./routes")

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Origin",
      "Access-Control-Request-Headers",
    ],
    credentials: true,
    enablePreflight: true,
  })
);

app.use(express.json())

const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.get("/reset",async(req,res) => {
    try {
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await db.sync({ alter: true });
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        
        res.status(200).send("Db reset complete!")
    } catch(err) {
        res.status(500).send({message: "Db reset failed",err: err.message})
    }
})



app.use("/api",router);



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  app.post("/api/upload", upload.single("file"), function (req, res, next) {
    console.log(req.file);
    res.send({ message: "Project uploaded successfully" });
  });



app.use("/",(req,res) => {
    res.status(200).send("Merge server")
})

app.listen(port, ()=> {
    console.log(`Server is running on ${port}`);
    console.log(`http://localhost:${port}`);
})