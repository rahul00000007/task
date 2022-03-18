const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({

    question :{
        type:String,
        required : true

    },
    option1:{
        type: String,
        required :true
    },

    option2 :{
        type :String,
      required:true
    },
    option3:{
        type :String,
      required:true

    },
    
    option4: {
        type :String,
      required:true
    }

})

mongoose.model("Questions",questionSchema);