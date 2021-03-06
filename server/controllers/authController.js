const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req,res) => {
        const {username,password,isAdmin} = req.body
        const db = req.app.get('db')
        const result = await db.get_user([username])
        const existingUser = result[0]
        if(existingUser) {
            res.status(409).json('Username taken')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)
        const registeredUser = await db.register_user([isAdmin,username,hash])
        const user = registeredUser[0]
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
            res.status(201).json(req.session.user)
    },

    login: async (req,res) => {
        const {username,password} = req.body
        const foundUser = await req.app.get('db').get_user([username])
        const user = foundUser[0]
        if(!user) {
            res.status(401).json('User not found.  Please register as a new user before logging in')
        }
        else {
            const isAuthenticated = bcrypt.compareSync(password,user.hash)
            if(!isAuthenticated) {
                res.status(403).json('Incorrect password')
            }
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
                }
                res.status(200).json(req.session.user)
        }
    },

    logout: async (req,res) => {
        req.session.destroy()
        res.status(200).json('User logged out')
    }
}