//cara import di node.js
const express = require('express')
//nama bebas
const app = express()
//port bebas
const port = 2020

// Agar dapat menerima object saat post (req.body)
app.use(express.json())
//yang diatas adalah config API

//config MongoDB
//import mongodb
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
//API tujuan
const URL = 'mongodb://127.0.0.1:27017'
//database yang digunakan
const database = 'API-MongoDB'

// parameter yang ditengah untuk mengubah URL yang dalam bentuk string menjadi sebuah alamat yang dpt dipahami
//kalau error, parameter error akan berisi informasi, kalau tidak error yang sebelah kanan yang ada isinya
//koneksi ke mongoDB
MongoClient.connect(URL, {useNewUrlParser : true, useUnifiedTopology: true}, (err, client)=>{
    //jika terdapat error, 'err' akan berisi object error, dan kemudian akan memunculkan isi dari console.log()
    if(err){
        return console.log(err)
    }

    //untuk menentukan database mana yang akan digunakan
    const db = client.db(database)

    //function get menerima 2 param, 1. string, 2. function
    //setiap update data, restart ulang node.inde.js
    //respond visa dalam bentuk apapun, termasuk tag html
    //note:
    // app.get('/users', (req, res)=>{
    //     res.send(
    //         {
    //             status: 200, 
    //             name: req.query
    //         }
    //     )
    // })

    // // kalau ngepost data ada di body
    // app.post('/users', (req, res) => {
    //     res.send(
    //         req.body
    //     )
    // })

})
//running API
//function bawaan
app.listen(port, ()=> {console.log('API running at port' + port)})













