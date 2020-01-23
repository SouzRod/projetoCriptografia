const Descriptografar = require('./descriptografar')

const token = 'f84f109f2823f71306f0026fa93c311a5a0e4cd0'
const descriptografar = new Descriptografar(token)

const result = descriptografar.descriptografando()
    .then(result => result)
    .catch(error => error)