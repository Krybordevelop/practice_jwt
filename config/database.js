const mongoose =require('mongoose')

const {MONGO_URI} = process.env

exports.connect = () =>{
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log('successfullu connected to DB')
    })
    .catch((error)=>{
        console.log("could not connect to DB")
        console.error(error)
        process.exit(1)
    })
}