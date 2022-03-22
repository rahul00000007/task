const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Questions = mongoose.model("Questions");
const adminQuestions = mongoose.model('adminQuestions')
const jwt = require('jsonwebtoken');
const {JWT_SECRETKEY} = require('../valuekeys');
const  requireLogin = require('../middleware/requireLogin');
const logs = require('../config/logger');
router.get('/',(req,res)=>{
    res.send("hello rahul")
})
router.post("/addQuestion", (req,res)=>{
    
    console.log(req.body);
    const {questionNumber,question,option1,option2,option3,option4} = req.body;
    if(!questionNumber||!question || !option1 || !option2 || !option3 || !option4){
        res.status(422).json({error:"should not empty"});
    }
    Questions.findOne({questionNumber:questionNumber}).then((savedQuestion=>{

   
    if(savedQuestion){

    return res.json({error:"Question already exists"})
    }
else{

    const questions = new Questions( {
        questionNumber:questionNumber,
        question: question,
        option1:option1,
        option2:option2,
        option3:option3,
        option4:option4,

        
    })
    questions.save().then(ques=>{

        
       res.json({message:"Question saved succesfully"});

       logs.info("Question saved successfully");
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

router.get('/findQuestion/:questionNumber', requireLogin,(req,res)=>{
    const questionNumber = req.params.questionNumber;
    Questions.findOne({questionNumber:questionNumber}).then((savedQuestion=>{
        console.log(savedQuestion)
           if(savedQuestion){
           
            res.json(savedQuestion)
            }
            else{
                logs.error('no question found')
                res.send('no question found')
            }
        



    }))
})


router.put("/updateQuestion/:questionNumber" , requireLogin, (req,res)=>{
    
    
const query = req.params.questionNumber


// Replace it with a new document
const replacement = {
    "questionNumber":req.params.questionNumber,
    "question": "Who is captain of India team",
    "option1":  "Dhoni",
    "option2": "Kohli",
    "option3": "Iyer",
    "option4": "Rahul",
    
}
// Return the original document as it was before being replaced
const options = { "returnNewDocument": false };
 Questions.findOneAndReplace({'questionNumber':query}, replacement, options)
  .then(replacedDocument => {
    if(replacedDocument) {
        logs.info('Successfully replaced the  document')
      res.send(`Successfully replaced the following document: ${replacedDocument}.`)
    } else {
      res.send("No document matches the provided query.")
    }
   
  })
  .catch(err => logs.error(`Failed to find and replace document: ${err}`))
})




router.delete('/deleteQuestion/:questionNumber', requireLogin,(req,res)=>{
   
    const deleteQuestion = req.params.questionNumber;

    Questions.deleteOne({'questionNumber':deleteQuestion}).then((del)=>{
        if(del){
            logs.info('deleted succcesfully')
            res.send("deleted succcesfully")
        }
        else{
            logs.error('error in deleting question')
            res.send("error in deleting question")
        }

    })

})



router.get('/adminLogin', requireLogin,(req,res)=>{
Questions.find().then((result)=>{
    let allQuestions = result;
    if(allQuestions.length>0){
        adminQuestions.insertMany(allQuestions).then((result)=>{
            res.send("records saved succesfully in admin database")
        })
    

    }
    else{
        res.send("No records are there to insert in admin database")
    }

})

router.get('/studentLogin',requireLogin,(req,res)=>{

    adminQuestions.find().then((result)=>{

        if(result.length>0){
            logs.info("Questions fetched successfully")
            res.send(result)
        }
        else{
            logs.error("No records found")
            res.send("No records found")
        }

    })
})

})



module.exports = router;



