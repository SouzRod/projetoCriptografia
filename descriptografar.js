const axios = require('axios');
const request = require('request');
const fs = require('fs');
const crypto = require("crypto");


module.exports = class Descriptografar {
    constructor(token) {
        this.token = token
    }

    async descriptografando() {

        try {

            let result = await axios.get(`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${this.token}`)
            let data = result.data

            fs.writeFile('answer.json', JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });

            let decifrado = Descriptografar.cesariano(data.cifrado, data.numero_casas)
            data.decifrado = decifrado

            let resumo = crypto.createHash("sha1").update(decifrado).digest("hex");
            data.resumo_criptografico = resumo

            fs.writeFile('answer.json', JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('Replaced!');
            })

            const filePath = (__dirname + '/answer.json')
            fs.readFile(filePath, 'utf-8', (err, file) => {

                if (err) console.error(err)

                const formData = {
                    answer: {
                        value: file,
                        options:
                        {
                            filename: 'answer',
                            contentType: 'multipart/form-data'
                        }
                    }
                }

                const options = {
                    method: 'POST',
                    url: `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${this.token}`,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    formData
                }

                request(options, (err, res, body) => {
                    if (err) throw new Error(err.message)
                    console.log(body)
                    return body
                })

            })
        } catch (e) {
            console.error(e)
        }

    }

    static cesariano(texto, passo) {

        let alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        let number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

        let textoSplitado = texto.toLowerCase().trim().split('')

        let ArrayLetras = []

        for (let letraText of textoSplitado) {
            if (letraText == ' ') {
                ArrayLetras.push(letraText)
                continue
            }


            if (letraText == '.' || letraText == ',' || letraText == '!' || letraText == '?') {
                ArrayLetras.push(letraText)
                continue
            }

            if (letraText == ',') {
                ArrayLetras.push(letraText)
                continue
            }

            for (let num of number) {
                if (num === letraText) {
                    ArrayLetras.push(letraText)
                    continue
                }
            }

            for (let letraAlfa = 0; letraAlfa < alfabeto.length; letraAlfa++) {
                if (letraText == alfabeto[letraAlfa]) {
                    if (passo > letraAlfa) {
                        let sub = passo - letraAlfa
                        ArrayLetras.push(alfabeto[(alfabeto.length) - sub])
                        continue
                    } else {
                        ArrayLetras.push(alfabeto[letraAlfa - passo])
                        continue
                    }
                }
            }
        }
        let textoFinal = ArrayLetras.join('')
        return textoFinal
    }
}