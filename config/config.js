require("dotenv").config();
module.exports = {
    development:{
        username:'root',
        password:'!3001jun',
        database:'project',
        host:'localhost',
        dialect:'mysql',
        pool:{
            mas:1000,
            min:0,
            acquire:30000,
            idle:1000
        }
    },
    test:{
        username:'root',
        password:'!3001jun',
        database:'project',
        host:'localhost',
        dialect:'mysql',
        pool:{
            mas:1000,
            min:0,
            acquire:30000,
            idle:1000
        }
    },
    production:{
        username:'root',
        password:'!3001jun',
        database:'project',
        host:'localhost',
        dialect:'mysql', 
        pool:{
            mas:1000,
            min:0,
            acquire:30000,
            idle:1000
        }
    }
}