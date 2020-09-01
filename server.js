const express = require('express')
const exphs = require('express-handlebars')
const mongoose = require('mongoose')
const csv = require('fast-csv')
const fs = require('fs')
const path = require('path')
const app = express()
mongoose.connect('mongodb://127.0.0.1:27017/coviddb', {useNewUrlParser:true,useUnifiedTopology: true})
const stream = fs.createReadStream('public/covid.csv')
let countries = ["Ghana"]
let PORT = 3000
let hbs = exphs.create()
const cases = []
const data = require('./Data/data')

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
const ParseData = () =>{
    csv.parseStream(stream)
    .on('error', (err) => console.log(err)
    .on('data', (row) => {
        if(countries.includes(row[3])){
            cases.push({
                Country_Region:row[3],
                Confirmed:row[7],
                Death:row[8],
                Recovered:row[9],
                Active:row[10],
            })
            console.log(cases.json());
        }
    })
    .on('end', ()=> console.log(`${cases.length} data parsed`)))

  
}
app.get('/', (req, res)=>{
    res.render('home', {title: 'Covid-19', data: data})
})
ParseData()


app.listen(PORT, ()=>{
    console.log(`Server started and running \n http://localhost:${PORT}`)
})