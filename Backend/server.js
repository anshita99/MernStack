const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const cors=require('cors');
const Category=require('./models/category');
const createCategory=require('./category.json')
const userRouter=require('./routes/userRoutes')
const cookieParser=require('cookie-parser');
const requireAuth=require('./requireAuth')
const User=require('./models/user')
dotenv.config();
const corsOptions = {
    exposedHeaders: 'auth-token',
  };
  
  const app=express();
//   app.use(cors())
  app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


mongoose.set('runValidators', true);

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => 
        console.log('Database is connected..')
    ).catch(err => console.log( err ))

    
        app.listen(5000, () => {
            console.log("Server is up and running on port 5000")
        }
        )
    
app.get('/find',(req,res)=>{
    const user=User.find()
    .then(result=>res.send({}))
    console.log("hello")
})
app.use(userRouter)
