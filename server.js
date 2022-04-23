const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
var cors = require('cors')
// Import csv-writer
const csvwriter = require('csv-writer')
  
var createCsvWriter = csvwriter.createObjectCsvWriter
  
// Passing the column names intp the module
const csvWriter = createCsvWriter({
  
  // Output csv file name is geek_data
  path: 'register.csv',
  header: [
  
    // Title of the columns (column_names)
    {id: 'Name', title: 'Name'},
    {id: 'Email', title: 'Email'},
    {id: 'Phone', title: 'Phone'},
    {id:'CollegeName',title:'CollegeName'},
  ]
});
const path = require('path');


app.use(cors())
app.use(bodyParser.urlencoded({extended:false}));


mongoose.connect('mongodb+srv://heamanth:viratkholi18@cluster0.jdv7l.mongodb.net/participant?retryWrites=true&w=majority', 
{useNewUrlParser: true, useUnifiedTopology: true});
const ParticipantSchema = mongoose.Schema({
    Name:String,
    Email:String,
    Phone:Number,
    CollegeName:String
});
const Participant = new mongoose.model("Participant",ParticipantSchema);


const fileName = "register.csv";
// const csvFile = fs.createWriteStream(fileName);
// const stream = format({ headers:true });

app.listen(process.env.PORT || "3000",function(){
    console.log("server started in port 3000");
});

app.post("/register",function(req,res){
    console.log(req.body,req.body.name)
   
    const newparticipant = new Participant({
        Name:req.body.name,
        Email:req.body.email,
        Phone:req.body.phone,
        CollegeName:req.body.clgName
    })
    newparticipant.save()

    
    res.redirect('https://metagraphia2022.netlify.app/')
});

app.get('/downloadcsv',(req,res)=>{
    // stream.pipe(csvFile);
    Participant.find({},(err,database)=>{
        // console.log(database)
        csvWriter.writeRecords(database)
        .then(()=>
         console.log('Data uploaded into csv successfully'));
        if(!err){
            for (var data=0;data < database.length;data++){
                console.log(" ........hi there"+database[data])
                
                
            }
        }
        else{
            console.log(err)
        }
        // stream.end();
        res.sendFile(path.join(__dirname, 'register.csv'))
    })

})