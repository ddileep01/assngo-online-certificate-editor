var Express = require('express');
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');

var app = Express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://assadmin:kKmwxfHI9IOUK4EV@cluster0.y6af3oc.mongodb.net/?retryWrites=true&w=majority";

var DATABASENAME = "assdatabase";
var database;

app.listen(5038,()=>{
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database = client.db(DATABASENAME);
        console.log("MongoDB connection established");
    })
})

app.get('/api/asswebapp/GetHistory',(request,response)=>{
    database.collection("certificationscollection").find({}).toArray((error,result)=>{
        response.send(result);
    });
})

app.post('/api/asswebapp/AddCertificate',multer().none(),(request,response)=>{
    database.collection("asswebappcollection").count({},function(error,numOfCertificates){
        database.collection("asswebappcollection").insertOne({
            s_id:(numOfCertificates + 1).toString(),
            name:request.body.newName
        });
        response.json("Added Successfully");
    })
});

app.delete('/api/asswebapp/DeleteCertificate',(request,response)=>{
    database.collection("asswebappcollection").deleteOne({
        s_id:request.query.s_id
    });
    response.json("Deleted Successfully");
})