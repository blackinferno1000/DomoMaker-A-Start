const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setPersonality = (personality) => _.escape(personality).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
  personality: {
    type: String,
    required: true,
    trim: true,
    set: setPersonality,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  personality: doc.personality,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age personality').lean().exec(callback);
};

// DomoSchema.statics.updateDomo = (domoId, callback) => {
//   const search = {
//     name: domoId
//   }

//   return Domo.DomoModel.findOneAndUpdate(search, {$set:
//     {name: req.body.name, age: req.body.age, personality: req.body.personality}},
//     (err, doc) => {
//     if(err){
//       console.log("Something wrong when updating data!");
//     }

//     console.log(doc);
//     res.json({ redirect: '/maker' });
//   }
// };

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
