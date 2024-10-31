let express=require('express')
var myRouter=express.Router()
var usersModul=require('../moduls/userModul')

myRouter.get("/getAll", (req, res) => {
    usersModul.find({}).then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});
myRouter.get("/getByName&Pass/:name/:pass",(req,res)=> {
    let n=req.params.name
    let p=req.params.pass
    usersModul.find({userName:n,password:p}).then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

myRouter.post('/addUser', async(rq, rs) =>             
{
    try
    {
       let myUser = rq.body
    console.log("Request Body:", myUser);

    const newUser = await usersModul.create({userName:myUser.userName,
        password:myUser.password,
        address:myUser.address,
        phon:myUser.phon,
        isManager:false,
        favorites:[]
         })
        rs.json(newUser)

        console.log(myUser);
    }
    
    catch(e)
        {
            console.error(e)
            rs.status(500).json({ error: 'Failed to create user' });
        }
    });
    


myRouter.put('/addFavorite/:idUser/:favoriteFood' , (req,res)=>
{
    let User=req.params.idUser;
    let ff=req.params.favoriteFood;

    usersModul.findById(User).exec()
  .then(function(user) {
    if (user) {
      // Access and modify the favorites array
      user.favorites.push(ff); // Add new item to favorites array

      // Save the updated user object
      return user.save();
    } else {
      console.error("User not found");
      // Handle user not found
    }
  })
  .then(function(updatedUser) {
    console.log("User favorites updated:", updatedUser);
    // Handle success
  })
  .catch(function(err) {
    console.error("Error:", err);
    // Handle error
  });
});
  
myRouter.get("/getFavorites/:id" ,(req,res)=>            
{
    
    let id=req.params.id;
    usersModul.findOne({password:id}).then((data) => 
    {
        res.status(200).json(data.favorites);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });

})

module.exports=myRouter