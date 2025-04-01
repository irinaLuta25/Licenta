const express=require('express')
const app=express()
const port=4848

app.use(express.json())

const {db}=require("./models")
app.get("/reset",async(req,res) => {
    try {
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await db.sync({ force: true });
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        res.status(200).send("Db reset complete!")

    } catch(err) {
        res.status(500).send({message: "Db reset failed",err: err.message})
    }
})

app.use("/",(req,res) => {
    res.status(200).send("Merge server")
})

app.listen(port, ()=> {
    console.log(`Server is running on ${port}`);
    console.log(`http://localhost:${port}`);
})