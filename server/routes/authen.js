const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Questions = mongoose.model("Questions");
const jwt = require('jsonwebtoken');
const {JWT_SECRETKEY} = require('../valuekeys');
const  requireLogin = require('../middleware/requireLogin');

router.get('/',(req,res)=>{
    res.send("hello rahul")
})
router.post("/addQuestion", (req,res)=>{
    
    console.log(req.body);
    const {question,option1,option2,option3,option4} = req.body;
    if(!question || !option1 || !option2 || !option3 || !option4){
        res.status(422).json({error:"should not empty"});
    }
    Questions.findOne({question:question}).then((savedQuestion=>{

   
    if(savedQuestion){
    return res.json({error:"Question already exists"})
    }
else{

    const questions = new Questions( {
        question: question,
        option1:option1,
        option2:option2,
        option3:option3,
        option4:option4,

        
    })
    questions.save().then(ques=>{
       res.json({message:"Question saved succesfully"});
   }).catch(err=>{
       console.log(err);
   })
}


   }))
   
   
})

router.get('/protected',requireLogin, (req,res)=>{
    res.send("logged in successfully");
})

router.post('/staffSignin',(req,res)=>{
    const {question}= req.body;
    
    Questions.findOne({question:question}).then((savedQuestion=>{
        console.log(savedQuestion);
        if(!savedQuestion){
            res.status(422).json({error:"Invalid question"})
        }
        
           if(savedQuestion){
           
            const token = jwt.sign({_id:savedQuestion._id},JWT_SECRETKEY);
            const {_id,question,option1,option2,option3,option4} = savedQuestion
            res.json({token, question:{_id,question,option1,option2,option3,option4}})
            }
            else{
                res.json({error:"Invalid question "});
            }
        



    }))

})

router.get('/findQuestion/:question', requireLogin,(req,res)=>{
    const question = req.params.question;
    Questions.findOne({question:question}).then((savedQuestion=>{
        console.log(savedQuestion)
           if(savedQuestion){
           
            res.json(savedQuestion)
            }
            else{
                res.send('no question found')
            }
        



    }))
})


router.put("/updateQuestion/:question" , requireLogin, (req,res)=>{
    
    
const query = req.params.question


// Replace it with a new document
const replacement = {
    "question": "Who is captain of India team",
    "option1":  "MSDDD",
    "option2": "Kohli",
    "option3": "Iyer",
    "option4": "Rahul",
    
}
// Return the original document as it was before being replaced
const options = { "returnNewDocument": false };
 Questions.findOneAndReplace({'question':query}, replacement, options)
  .then(replacedDocument => {
    if(replacedDocument) {
      res.send(`Successfully replaced the following document: ${replacedDocument}.`)
    } else {
      res.send("No document matches the provided query.")
    }
   
  })
  .catch(err => console.error(`Failed to find and replace document: ${err}`))
})




router.delete('/deleteQuestion/:question', requireLogin,(req,res)=>{
   
    const deleteQuestion = req.params.question;

    Questions.deleteOne({'question':deleteQuestion}).then((del)=>{
        if(del){
            res.send("deleted succcesfully")
        }
        else{
            res.send("error in deleting question")
        }

    })

})




module.exports = router;



