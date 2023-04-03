const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql') 


const app = express()
const port = process.env.PORT ||5000

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json()) 

const pool = mysql.createPool({
    connectionLimit : 2 ,
    host : 'localhost' ,
    user : 'root',
    password : '',
    database :'demixer'

})



app.get('',(req ,res) => {
    pool.getConnection((err,connection) =>{
    if(err) throw err 
   console.log("se ha conectado correctamente ")

// const insertar = "INSERT INTO deximer (nombre,apellido,email) VALUES ('Ruben','Rodriguez','Oscar@gmail.com')"
//       connection.query(insertar,(err, rows)=> {
//         if(err) throw err
//       })


   connection.query('SELECT * from deximer',(err,rows) =>{
        connection.release()
        if(!err) {
           rows.forEach( row => {
            console.log(row)
           });
            res.send(rows)
        
           
        }else {
            console.log(err)
        }
    })

    })
})










app.listen(port, () => console.log(` Listen on port ${port}`))


