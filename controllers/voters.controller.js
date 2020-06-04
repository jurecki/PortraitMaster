const Voter = require('../models/voter.model');

exports.load = async (req, res) => {

    try {
        res.json(await Voter.find());
    } catch (err) {
        res.status(500).json(err);
    }

};


exports.add = async (req, res) => {
    try {
        const ip = req.clientIp;
        const id = req.params.id
        console.log('ID', id)

        const votesToUpdate = await Voter.findOne({ user: ip });
        if (!votesToUpdate) {
            //uzytkownik jest w bazie, spradz czy glosowal na dane zdjecie
            console.log('uzytkownik istnieje wbazie')

        } else {
            //brak uzytkownika w bazie
            const newVoter = new Voter({ user: ip, votes: id });
            newVoter.save(); // ...save new vote in DB

            res.json({ message: 'OK' })
        }

    } catch (err) {
        res.status(500).json(err);
    }

};