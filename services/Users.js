'use strict';
//
// Set of functions responsible of managing users
// In charge of CRUD operations relating users
//

const Users = {};

Users.login = (req, res, db) => {
  if(!req.get('email') || !req.get('password')) {
    res.status(400);
    res.send({msg: 'Email and password required.'});
  }
  db.collection('users').findOne({'email': req.header('email'), 'password': req.header('password')}, (err, r) => {
    if(err || !r) {
      res.status(404);
      res.send({msg:'Email or password wrong.'});
    }
    else res.send(r);
  });
};

Users.signup = (req, res, db) => {
  if(!req.body.email || !req.body.password) {
    res.status(400);
    res.send('Email and password required.');
  }
  else {
    db.collection('users').findOne({'email': req.body.email}, (err, r) => {
      if(!err && r) {
        res.status(403);
        res.send('There is already a user with the email provided.');
      }
      else {
        db.collection('users').insertOne({
          email: req.body.email,  
          password: req.body.password
        }, (err, r) => {
          if(err) {
            res.status(500);
            res.send('An error ocurred during the operation.');
          }
          else {
            res.send(r.ops[0]);
          }
        });
      }
    });
  }
};

Users.update = (req, res, db) => {
  if(!req.body.email || !req.body.password) {
    res.status(400);
    res.send('Email and password required.');
  }
  else {
    db.collection('users').findOneAndUpdate({'email': req.body.email}, {$set: {'password': req.body.password}}, (err, r) => {
      if(err || !r.value) {
        res.status(404);
        res.send('User not found.');
      }
      else res.send(r.value);
    });
  }
};

Users.delete = (req, res, db) => {
  if(!req.body.email) {
    res.status(400);
    res.send('Email required.');
  }
  else {
    db.collection('users').findOneAndDelete({'email': req.body.email}, (err, r) => {
      if(err || !r.value) {
        res.status(404);
        res.send('User not found.');
      }
      else res.send('User removed successfully.');
    });
  }
};

//Export as a file, in order to call it like: Users.[function]
module.exports = Users;
