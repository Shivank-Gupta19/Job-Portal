const express = require('express')
const app = express()
const cors=require('cors')
const port =process.env.PORT || 5000;
require('dotenv').config()
// console.log()
// console.log(process.env.DB_PASSWORD)
//middleware
app.use(express.json())
app.use(cors(
 
))
// user-adityaprasanan2003
// pass-vKN8BkKFNTWWThI3


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal.nz1gcyr.mongodb.net/?retryWrites=true&w=majority&appName=job-portal`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create db
    const db=client.db("jobportal")
    const jobCollection=db.collection("demoJobs")
      //post a job
      app.post("/post-job",async(req,res)=>{
        const body=req.body;
        body.createAt=new Date();
        // console.log(body)
        const result=await jobCollection.insertOne(body);
        if(result.insertedId){
            return res.status(200).send(result); 
        }
        else {
            return res.status(404).send({
                message:"can not insert try again",
                status:false
            });
        }
      })
    // get all jobs
    app.get("/all-jobs",async(req,res)=>{
        const jobs=await jobCollection.find().toArray()
        res.send(jobs);
    })
    // get single job by using id
    app.get("/all-jobs/:id",async(req,res)=>{
      const id=req.params.id;
      const job=await jobCollection.findOne({
        _id:new ObjectId(id)

      })
      res.send(job)
    })
    // get jobs by email
    app.get("/myJobs/:email",async(req,res)=>{
      // console.log(req.params.email)
      // const {email}=req.params;
      const jobs=await jobCollection.find({postedBy: req.params.email}).toArray();
      res.send(jobs)
    })
    // delete a job
    app.delete("/job/:id",async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)}
      const result=await jobCollection.deleteOne(filter) ;
      res.send(result)
    })
    // update a job
    app.patch("/update-job/:id",async (req,res)=>{
      const id=req.params.id;
      const jobData=req.body;
      const filter={_id:new ObjectId(id)}
      const options={upsert:true};
      const updateDoc={
        $set:{
          ...jobData
        },
      };
      const result=await jobCollection.updateOne(filter,updateDoc,options);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
