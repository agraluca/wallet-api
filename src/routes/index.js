import express from 'express'

import * as UserController from '../controllers/User.js'
import * as controllers from '../controllers/index.js'
import * as UserWalletController from '../controllers/UserWallet.js'

import { checkToken } from '../utils/index.js'

const routes = express.Router()
//! Auth
routes.post('/auth/register', UserController.createUser)
routes.post('/auth/signin', UserController.sigInUser)
routes.post('/auth/refresh', checkToken, UserController.refreshToken)
//! Stock
routes.get('/stock/:ticker', checkToken, controllers.Stock.show)
//! Wallet
routes.get('/wallet/get', checkToken, UserWalletController.getUserWallet)
routes.post('/wallet/add', checkToken, UserWalletController.addStockToWallet)
routes.put('/wallet/update', checkToken, UserWalletController.updateWallet)
routes.delete('/wallet/remove/:id', checkToken, UserWalletController.removeStockFromWallet)
//! FixedIncomeWallet
routes.post('/walletFixedIncome/add', checkToken, UserWalletController.addFixedIncomeToWallet)
routes.put('/walletFixedIncome/update', checkToken, UserWalletController.updateFixedIncomeToWallet)
routes.delete('/walletFixedIncome/remove/:id', checkToken, UserWalletController.removeFixedIncomeFromWallet)

routes.get('/', (req, res) => res.send('Wallet API'))

export default routes
