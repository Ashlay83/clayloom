import {app} from './app.js';
import {port} from "./config.js"
import {connectDB} from './config.js'


await connectDB();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    
});


