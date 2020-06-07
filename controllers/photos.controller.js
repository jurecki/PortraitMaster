const Photo = require('../models/photo.model');
const Voter = require('../models/Voter.model.js')
var sanitize = require('mongo-sanitize');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const title = sanitize(req.fileds.title);
    const author = sanitize(req.fields.author);
    const email = sanitize(req.fields.email)
    const file = req.files.file;

    if (title && author && email && file) { // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0];
      if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png' || fileExt === 'gif') {
        const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);
      } else {
        throw new Error('Wrong input!');
      }


    } else {
      throw new Error('Wrong input!');
    }

  } catch (err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {
  const ip = req.clientIp;
  const id = req.params.id;

  try {
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    const voterToUpdate = await Voter.findOne({user: ip})
    
    if(!voterToUpdate) {
      const newVote = new Voter({user: ip, votes: id})
      newVote.save();
      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({message: 'OK'})
    } else {
      
      const voterToUpdatePhoto = await Voter.findOne({votes: id})
      
      if(!voterToUpdatePhoto) {
        const newVote = new Voter({user: ip, votes: id})
        newVote.save();
        photoToUpdate.votes++;
        photoToUpdate.save();
        res.send({message: 'OK'})
      } else  res.status(500).json(err);
    }

      
    
  } catch(err) {
    res.status(500).json(err);
  }

};
