require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
const {json} = require('body-parser')
const ac = require('./controllers/authController')
const tc = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')
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

app.post('/api/treasure/user', auth.usersOnly, tc.addUserTreasure)
app.get('/api/treasure/user', auth.usersOnly, tc.getUserTreasure)
app.get('/api/treasure/dragon', tc.dragonTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, tc.getAllTreasure)


app.listen(port, () => console.log(`Server listening on ${port}`))
