import UserWalletModel from '../models/userWallet.js'
import {validateParams} from '../utils/index.js'

const paramsSchemaOnlyUserEmail = {
  userEmail: ""
}


function index(req, res) {
  const errors = validateParams(req.params, paramsSchemaOnlyUserEmail)

  if(errors){
    return res.status(400).JSON(errors);
  }

  const {userEmail} = req.params

  UserWalletModel.findOne({email: userEmail},(err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {

      !!data ? res.status(200).json(data): res.status(404).json({message: `Não foi encontrado um usuário com o email: ${userEmail}`})
      
    }
  });
}

 function save(req, res) {
  const paramsSchema = {email: "", name: ""}
  const errors = validateParams(req.body, paramsSchema)
  if(errors){
    return res.status(400).json(errors);
  }

  const {email, name} = req.body;

  UserWalletModel.find({email}, (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if(data.length === 0){
        
        const newUser = new UserWalletModel({
          name,
          email,
          wallet: []
        }); 
        newUser.save();
        return res.status(200).json()
      } else {
        return res.status(409).json({message: "Usuário já existe no sistema!"})
      }
    }
  })

}

async function remove(req, res){
  const errors = validateParams(req.params, paramsSchemaOnlyUserEmail)
  const {userEmail: email} = req.params;

  if(errors){
    return res.status(400).json(errors);
  }

  const response = await UserWalletModel.remove({email})

  return res.status(200).json({message: "Dados removidos com sucesso!", deleteCount: response.deletedCount})

}

async function addStockInWallet(req, res) {
  try{
    
    const paramsSchema = {email: "",tickerName: "", companyName: "", tickerType: "", formattedPrice: ""};

    const errors = validateParams(req.body, paramsSchema)
  
    if(errors){
      return res.status(400).json({errors})
    }

    const {email, tickerName, companyName, tickerType, formattedPrice, qtd} = req.body

    const user = await UserWalletModel.findOne({email})
    user.wallet.push({tickerName, companyName, tickerType, formattedPrice, qtd})

    const response = await UserWalletModel.updateOne({email}, {wallet: user.wallet})

    return res.status(200).json({message: "Ativo adicionado com sucesso"})

  }catch(error){
    return res.status(400).json(error)
  }
  

  

}



export const UserWallet = {
  index,
  save,
  remove,
  addStockInWallet
}