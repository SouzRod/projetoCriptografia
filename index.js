require('dotenv').config()

const Descriptografar = require('./descriptografar')
const descriptografar = new Descriptografar(process.env.TOKEN)

const result = descriptografar.descriptografando()
    .then(result => result)
    .catch(error => error)