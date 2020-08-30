import express from 'express';
import bodyParser from 'body-parser';
import {deposit, withDraw, checkBalance, deleteAccount, transferBetweenAccounts, averageCustomerBalance, checkCustomerLowerBalance, checkCustomerHightBalance, transferCustomerToPrivateAgency} from './app/controllers/accountsController.js';
const routes = express.Router();

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));

routes.put('/bank/deposit', deposit);
routes.put('/bank/withDraw', withDraw);
routes.get('/bank/checkBalance/:idAgency/:idAccount', checkBalance);
routes.delete('/bank/deleteAccount/:idAgency/:idAccount', deleteAccount);
routes.put('/bank/transfer', transferBetweenAccounts);
routes.get('/bank/averageBalance/:idAgency', averageCustomerBalance);
routes.get('/bank/lowerBalance/:pages', checkCustomerLowerBalance);
routes.get('/bank/hightBalance/:pages', checkCustomerHightBalance);
routes.put('/bank/transferPrivateAccount', transferCustomerToPrivateAgency);

export default routes;


