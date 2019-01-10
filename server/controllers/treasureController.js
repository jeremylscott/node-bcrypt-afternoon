const bcrypt = require('bcryptjs')


module.exports = {
    dragonTreasure: async (req,res) => {
        const treasure = await req.app.get('db').get_dragon_treasure(1)
        res.status(200).json(treasure)
    },

    getUserTreasure: async (req,res) => {
        const moreTreas = await req.app.get('db').get_user_treasure([req.session.user.id])
        res.status(200).json(moreTreas)
    }

}