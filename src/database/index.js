import mongoose from 'mongoose';

import 'dotenv/config.js';


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(response => console.log('Conected to Database...'))
.catch(error=> console.log('error ->', error.message));

export default mongoose;