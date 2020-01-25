require('dotenv').config()

const Descriptografar = require('./descriptografar')
const descriptografar = new Descriptografar(process.env.TOKEN)

descriptografar.descriptografando()
    .then(result => result)
    .catch(error => error)