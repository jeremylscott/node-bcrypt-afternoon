require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
const {json} = require('body-parser')
const ac = require('./controllers/authController')
const treasureController = require('./controllers/treasureController')
const port = 4000

app.use(json())

const {CONNECTION_STRING, SESSION_SECRET} = process.env

massive(CONNECTION_STRING)
    .then (db => {
        app.set('db',db)
        console.log('Database Connected')})
    .catch(err => console.log(err))

app.use(session({
    resave: true,
    saveUnititialized: false,
    secret: SESSION_SECRET
}))

app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)
app.get('/api/treasure/dragon', treasureController.dragonTreasure)
app.get('/api/treasure/user', treasureController.getUserTreasure)


app.listen(port, () => console.log(`Server listening on ${port}`))
