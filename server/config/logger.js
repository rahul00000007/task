const {createLogger,
    transports,
    format} = require('winston');
    
    require('winston-mongodb')


const logger = createLogger({
    transports:[
        new transports.File({
            filename:'info.log',
            level:'info',
            format:format.combine(format.timestamp(),format.simple())
        }),
        new transports.MongoDB({
            level:'error',
            db:"mongodb+srv://Rahul:u8DPPIjGA56Vqv3G@cluster0.myhem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            collection:'logs',
            format:format.combine(format.timestamp(),format.simple(),format.errors({stack:true}))


        }),
        new transports.MongoDB({
            level:'info',
            db:"mongodb+srv://Rahul:u8DPPIjGA56Vqv3G@cluster0.myhem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            collection:'logs',
            format:format.combine(format.timestamp(),format.simple(),format.errors({stack:true}))


        })

    ]
})
module.exports = logger;