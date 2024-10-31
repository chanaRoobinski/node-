

let express=require('express')
let app=express()

const cors = require('cors');
app.use(cors());

let myMongo=require('mongoose')

var bodyParser=require('body-parser')
app.use(bodyParser())

var path=require('path')

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }));

app.listen(3000,()=>
{
    console.log("run!!!");
})

myMongo.connect("mongodb://localhost:27017/my-db", { }) 
var db=myMongo.connection
db.on('open',()=>{
    //פונקציה שתקרה בעת פתיחה
    console.log("db open!!!!!!!!!!!!!!!!!!!!!");
    
})

let Users=require('./controlers/userControler')
app.use('/users',Users)

let Recipes=require('./controlers/recipesControler');
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits:{fileSize: 1024 *1024 *10}
}))
app.use('/recipes',Recipes)
