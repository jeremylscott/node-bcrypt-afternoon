const bcrypt = require('bcryptjs')

module.exports = {
    usersOnly: async (req,res,next) => {
        if(!req.session.user) {
            res.status(401).json('Please log in')
        }
        else {
            next()
        }
    },

    adminsOnly: async (req,res,next) => {
        if(!req.session.user.isAdmin) {
            res.status(403).json('Your not an admin')
        }
        next()
    }
}