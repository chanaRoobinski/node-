var express =require('express')
var router=express.Router()
var recipModul=require('../moduls/recipeModul')
var usersModul=require('../moduls/userModul')
var middlewar=require('../middleware/smiles')
router.use(middlewar)



router.get('/getAll',(req,res)=>
{
   recipModul.find({}).then((data)=>
   {
      res.status(200).json(data);
   })
   .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  });
});

router.get('/getById/:id' , (request,response)=>
{
   let id=request.params.id
   recipModul.findById(id).exec().then((data)=>
   {
      response.status(200).json(data);
   })
   .catch((err)=>
   {
      console.error(err);
      response.status(500).json({ error: 'Internal Server Error' });
   });
});

//מקבל קוד של מתכון למחיקה וסיסמא של משתמש שמוחק
router.delete('/delete/:id/:password' ,async (req,res)=>
{
   try
   {
      let id=req.params.id
      let pass=req.params.password
      
      
      const userData = await usersModul.findOne({ password: pass });
      if (!userData) {
         console.log("User not found");
         return res.status(404).send("User not found");
      }

      let flag = userData.isManager; //אם המשתמש שרוצה למחוק הוא מנהל- הוא יכול למחוק
      //console.log(flag);
      if (!flag) //אם לא מנהל יכול למחוק רק אם בעלים של המתכון
         {
         const recipData = (await recipModul.findById(id));
         //console.log(recipData);
         if (!recipData) {
            console.log("you can't delete this");
            return res.status(404).send("you can't delete this");
         }
         if (recipData.userPassword === pass) {
            flag = true;
         }
   }
     
   if (flag) {
         const delDoc = await recipModul.findOneAndDelete({ _id: id });
         console.log('Deleted document:', delDoc);
         return res.status(200).send("Document deleted successfully");
   } else {
         console.log("Unable to delete");
         return res.status(403).send("Unauthorized to delete document");
   }
} 
catch (error) 
{
  console.error(error);
  return res.status(500).send("Error deleted document");
}
});

router.post('/addRecipe',async (req,res)=>
{
try
{
   let recipe=req.body
   console.log("pic:  ",recipe.pictur);
   const newRecipe= await recipModul.create(
   {
   ingredients:recipe.ingredients,
   name:recipe.name,
   pictur:recipe.pictur,
   level:recipe.level,
   time:recipe.time,
   kind:recipe.kind,
   userPassword:recipe.userPassword
   });
   
   console.log("add: ",newRecipe);
   console.log("pic: ",newRecipe.pictur);
   res.json(newRecipe);
}
catch(e)
        {debugger
            console.error(e)
            res.status(500).json({ error: 'Failed to create recipe' });
        }
});


router.post('/uploadImg', async (req,res)=>
{

let image=req.files.image;
console.log(image.name);
let imageName=Buffer.from(image.name,'latin1').toString();
   image?.mv(`public/pic/food/${imageName}`, (err)=>
   {
      if(err)
         res.status(404).json("Upload image failed");
      else
         {
            res.json("Success upload image");
            console.log("Success upload image");
         }
   })
         
         
})


router.put('/update/:id', (req,res)=>
{
   let id=req.params.id;
   let update=req.body;

   recipModul.findByIdAndUpdate(id,update).then((updateRec)=>
   {
      if(updateRec)
        res.status(200).json(update);
   }).catch((err)=>
   {
      console.error("error:" , err);
   });
});
module.exports=router