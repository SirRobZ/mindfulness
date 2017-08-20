require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Reflection} = require('./models/reflection');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/api/reflections', authenticate, (req, res) => {
  var reflection = new Reflection({
    text: req.body.text,
    habits: req.body.habits,
    mindfulnessScore: req.body.mindfulnessScore,
    observeScore: req.body.observeScore,
    describeScore: req.body.describeScore,
    actingScore: req.body.actingScore,
    nonjudgingScore: req.body.nonjudgingScore,
    nonreactScore: req.body.nonreactScore,
    completedAt: new Date().getTime(),
    _creator: req.user._id
  });

  reflection.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/api/reflections', authenticate, (req, res) => {
  Reflection.find({
    _creator: req.user._id
  }).then((reflections) => {
    res.send({reflections});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/api/reflections/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Reflection.findOne({
    _id: id,
    _creator: req.user._id
  }).then((reflection) => {
    if (!reflection) {
      return res.status(404).send();
    }

    res.send({reflection});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/api/reflections/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Reflection.findOneAndRemove({
    _id: id,
    _creator: req.user.id
  }).then((reflection) => {
    if (!reflection) {
      return res.status(404).send();
    }

    res.send({success: true});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/api/reflections/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'habits']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Reflection.findOneAndUpdate({_id: id, _creator: req.user.id}, {$set: body}, {new: true}).then((reflection) => {
    if (!reflection) {
      return res.status(404).send();
    }

    res.send({reflection});
  }).catch((e) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/api/users', (req, res) => {
  var body = _.pick(req.body, ['fullName', 'email', 'password']);
  var user = new User(body);
  user.save().then((savedUser) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/api/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/api/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
    console.log(e);
  });
});

app.delete('/api/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then (() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
});

module.exports = {app};
