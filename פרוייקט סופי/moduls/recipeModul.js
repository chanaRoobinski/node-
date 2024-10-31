var myMongo=require('mongoose')
var recipModel=new myMongo.Schema({
    name:String,pictur:String,level:String,time:String,kind:String,userPassword:String,ingredients:Array
})
var MyRecipe=myMongo.model("MyRecipe",recipModel,"recipes")
module.exports =MyRecipe