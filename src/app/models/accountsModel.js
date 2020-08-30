import mongoose from '../../database/index.js';

const AccountsSchema = new mongoose.Schema({
    agencia: {
        type: Number,
        require:true
    },
    conta:{
        type: Number,
        require:true,
        unique: true
    },
    name:{
        type: String,
        require:true,
    },
    balance:{
        type: Number,
        require:true,
        min: 0
    }
})
const Accounts = mongoose.model('Accounts', AccountsSchema);

export default Accounts;