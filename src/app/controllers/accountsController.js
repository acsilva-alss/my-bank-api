import Accounts from '../models/accountsModel.js';

export async function deposit(req, res){
    try{
        const {agency, account, value } = req.body;
        
        const accountFound = await Accounts.findOne({'agencia': agency,'conta': account});
        if(!accountFound){
            return res.status(400).send({error: 'Agencia ou conta não existem'});
        }

        const newBalance = accountFound.balance + value;

        const updatedAccount = await Accounts.findOneAndUpdate({'agencia': agency, 'conta': account}, {'balance': newBalance});

        return res.send({'Balance': newBalance});

    }catch(err){
        return res.status(400).send({error: 'Erro no depósito '+err});
    }
};

export async function withDraw(req, res){
    try{
        const {agency, account, value } = req.body;
        const accountFound = await Accounts.findOne({'agencia': agency,'conta': account});
        if(!accountFound){
            return res.status(400).send({error: 'Agencia ou conta não existem'});
        }
        const tax = 1;
        if( value + tax > accountFound.balance){
            return res.status(400).send({error: 'Você não tem limite suficiente para realizar um saque de +'+value});
        }
        const newBalance = accountFound.balance - value -tax;
        const updatedAccount = await Accounts.findOneAndUpdate({'agencia': agency, 'conta': account}, {'balance': newBalance});

        return res.send({'balance': newBalance});
    }catch(err){
        return res.status(400).send({error: 'Erro no saque '+err});
    }
};

export async function checkBalance(req, res){
    try{
        const {idAgency,idAccount} = req.params;
        const accountFound = await Accounts.findOne({'agencia': idAgency,'conta': idAccount});
        if(!accountFound){
            return res.status(400).send({error: 'Agencia ou conta não existem'});
        }

        return res.send({'balance':accountFound.balance})

    }catch(err){
        return res.status(400).send({error: 'Erro na consulta do saldo '+err});
    }
};

export async function deleteAccount(req, res){
    try{
        const {idAgency,idAccount} = req.params;
        if(!await Accounts.findOneAndDelete({'agencia': idAgency,'conta': idAccount})){
            return res.status(400).send({error: 'Agência ou conta não existem'});
        }
        const allAccounts = await Accounts.find({'agencia': idAgency});

        return res.send({'TotalContas': allAccounts.length});

    }catch(err){
        return res.status(400).send({error: 'Erro ao excluir uma conta '+err});
    }
};

export async function transferBetweenAccounts(req, res){
    try{
        const {sourceAccount, targetAccount, value} = req.body;
        const sourceAccountFound = await Accounts.findOne({'conta': sourceAccount});
        const targetAccountFound = await Accounts.findOne({'conta': targetAccount});
        if(!sourceAccountFound){
            return res.status(400).send({error: 'Conta não existe'});
        }
        if(!targetAccountFound){
            return res.status(400).send({error: 'Conta não existe'});
        }
        let newSourceAccountBalance = sourceAccountFound.balance - value
        if(sourceAccountFound.agencia !== targetAccountFound.agencia){
            const tax = 8;
            newSourceAccountBalance = newSourceAccountBalance - tax;
        }

        const newTargetAccountBalance = targetAccountFound.balance + value;
        await Accounts.findOneAndUpdate({'conta': sourceAccount}, {'balance': newSourceAccountBalance});
        await Accounts.findOneAndUpdate({'conta': targetAccount}, {'balance': newTargetAccountBalance});

        return res.send({'Saldo conta origem': newSourceAccountBalance});

    }catch(err){
        return res.status(400).send({error: 'Erro ao transferir uma conta '+err});
    }
};

export async function averageCustomerBalance(req, res){
    try{
        const {idAgency} = req.params;
        const allAccountsOfAgency = await Accounts.find({'agencia': idAgency});
        if(!allAccountsOfAgency){
            return res.status(400).send({error: 'Agencia não existe'});
        }
        let sumBalanceAllAccounts = 0;
        allAccountsOfAgency.forEach(element =>{
            sumBalanceAllAccounts += element.balance;
        })

        const averageBalance = sumBalanceAllAccounts / allAccountsOfAgency.length;

        return res.send({'Balance médio': averageBalance.toFixed(2)});


    }catch(err){
        return res.status(400).send({error: 'Erro na consulta média dos saldos de uma agência '+err});
    }
};

export async function checkCustomerLowerBalance(req, res){
    try{
        const {pages} = req.params;
        const customersLowerBalance = await Accounts.find().sort({balance:1}).limit(Number(pages));
        console.log(customersLowerBalance);
        return res.send({customersLowerBalance})
    }catch(err){
        return res.status(400).send({error: 'Erro na consulta de clientes com menor conta '+err});
    }
};

export async function checkCustomerHightBalance(req, res){
    try{
        const {pages} = req.params;
        const customersHightBalance = await Accounts.find().sort({balance:-1}).sort({name:1}).limit(Number(pages));
        return res.send({customersHightBalance})
    }catch(err){
        return res.status(400).send({error: 'Erro na consulta de clientes com maior conta '+err});
    }
};

export async function transferCustomerToPrivateAgency(req, res){
    try{
        const allAccounts = await Accounts.find().sort({agencia: 1}).sort({balance:-1});
        let newAgency = 0;
        const arrayAccountsPrivate = [];
        allAccounts.forEach(element => {
            if(newAgency !== element.agencia){
                newAgency = element.agencia;
                arrayAccountsPrivate.push(element);
            }
        });

        for(let i = 0; i < arrayAccountsPrivate.length; i++){
            await  Accounts.findOneAndUpdate({conta :arrayAccountsPrivate[i].conta }, {agencia: 99});
        }

        const listPrivate = await Accounts.find({agencia:99})
        return res.send({listPrivate});
    }catch(err){
        return res.status(400).send({error: 'Erro na transferencia para a conta private '+err});
    }
};