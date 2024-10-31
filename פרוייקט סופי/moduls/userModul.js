var myMongo=require('mongoose')
debugger
var userModel=new myMongo.Schema({
    userName:String,password:String,address:String,phon:Number,isManager:Boolean,favorites:Array
})
var MyUser=myMongo.model("MyUser",userModel,"users")

module.exports=MyUser;