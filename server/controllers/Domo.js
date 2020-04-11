const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.personality) {
    return res.status(400).json({ error: 'RAWR! Name, personality, and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    personality: req.body.personality,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const getDomos = (req, res) => Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error ocurred' });
  }

  return res.json({ domos: docs });
});

const editDomo = (req, res) => Domo.DomoModel.findOneAndUpdate(req.body.id,
  { $set: { name: req.body.name, age: req.body.age, personality: req.body.personality } },
  (err, doc) => {
    if (err) {
      console.log('Something wrong when updating data!');
    }

    console.log(doc);
    res.json({ redirect: '/maker' });
  });

module.exports.makerPage = makerPage;
module.exports.makeDomo = makeDomo;
module.exports.getDomos = getDomos;
module.exports.editDomo = editDomo;
