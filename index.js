//jangan lupa bikin file .gitignore dan didalamnya masukkan /node_modules agar file tersebut tidak terupload juga ke dalam github
//ini adalah API
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

    console.log('berhasil terkoneksi dengan mongodb')
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

    // kalau ngepost data ada di body
    app.post('/users', (req, res) => {
        //Mengabil property name dan age dari req.body
        //destructuring
        const {name, age} = req.body

        //jadi di parseInt semua?// tanpa ini dicoba bisa
        name = parseInt(name)
        age = parseInt(age)

        //filter apakah name == string dan age == number
        if(isNaN(age)== true || isNaN(name)== false){
            res.send({
                "err_Message" : "Inputan anda salah" 
            })
        }else{

            //Create one user
            //cara masukkan data ke dalam database mongodb
            //sifatnya async
            db.collection('users').insertOne({name, age})
            .then((resp)=>{
                res.send({
                    // tinggal diatur mau seperti apa data ditampilkan
                    idNewUser : resp.insertedId,
                    dataUser: resp.ops[0]
                })
            }).catch((err)=>{
                res.send(err)
            })
        }
    })


     //Get one data berdasarkan age
    //findOne
    app.get('/findone', (req,res)=>{
        let age = parseInt(req.query.age)

        if(isNaN(age)== true){
            res.send({
                "err_Message" : "Inputan anda salah"
            })
        }else{
            //tidak usah pakai toArray()
            db.collection('users').findOne({age : age})
            .then((resp)=>{
                if(resp.length == 0){
                    res.send({
                        errMessage : "user tidak di temukan"
                    })
                }else {
                //hasil findOne dalam bentuk object dan hanya akan mencari satu data yang pertama kali ketemu
                res.send(resp)
                }
            }).catch((err)=>{
                res.send(err)
            })
        }
    })

    //Get many data berdasarkan age
    //find
    app.get('/find', (req,res)=>{
        let age = parseInt(req.query.age)

        if(isNaN(age)== true){ //bisa juga pakai if(!isNaN(age)) pakai truthy falsy untuk menjalankan
            res.send({
                "err_Message" : "Inputan anda salah" 
            })
        }else{

            db.collection('users').find({age : age}).toArray()
            .then((resp)=>{
                if(resp.length == 0){
                    res.send({
                        errMessage : "user tidak di temukan"
                    })
                }else {
                res.send(resp)
                }
            }).catch((err)=>{
                res.send(err)
            })
        }
    })

    //////////////////////////
    // LANJUTIN IF ELSE NYA!!!!!!!!//
    ////////////////////////

    //GET ALL USERS
    app.get('/alluser', (req,res)=>{
        db.collection('users').find({}).toArray()
        .then((resp)=>{
            res.send(resp)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    //DELETE BY NAME
    app.delete('/user/:name', (req,res)=>{
        let name = req.params.name

        name = name[0].toUpperCase() + name.slice(1) 

        db.collection('users').deleteOne({ name })
        .then((resp)=>{
            res.send(resp)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    //DELETE BY AGE
    //kalau /user juga maka akan masuk ke dalam delete by name, sehingga hasil tidak ketemu, maka bedakan halamannya (kalau method dan link sama tidak boleh, tetapi kalau salah satu berbeda tidak masalah)
    app.delete('/userage/:age', (req,res)=>{
        let age = parseInt(req.params.age)
        db.collection('users').deleteOne({ age })
        .then((resp)=>{
            res.send(resp)
        }).catch((err)=>{
            res.send(err)
        })
    })

    //EDIT BY NAME
    app.patch('/user/:name', (req,res)=>{
        let name = req.params.name
        let newName = req.body.newname

        //coba d lowercase belakangnya?
        name = name[0].toUpperCase() + name.slice(1)

        db.collection('users').updateOne({ name },{$set: {name: newName}})
        .then((resp)=>{
            res.send(resp)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
})
//running API
//function bawaan
app.listen(port, ()=> {console.log('API running at port' + port)})













