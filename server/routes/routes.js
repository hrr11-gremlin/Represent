var app = require('../server');
var express = require('express');
var CongressPerson = require('../models/congressPersonModel');
var scraperjs = require('scraperjs');

var router = express.Router();
var User = require('../models/userModel');

var saveToUser = function (user, values) {
  for (var key in values) {
    user[key] = values[key];
  }

  user.save();
  delete user.password;

  return user;
};

var scrapeBio = function (id) {
  return scraperjs.StaticScraper
    .create('http://bioguide.congress.gov/scripts/biodisplay.pl?index='+ id)
    .scrape(function($) {
      return $("body").map(function() {
        return $(this).text();
      }).get();
    });
}

//modified to return an array of all representatives names
router.get('/allMembers', function(req, res){
  CongressPerson.find({}, function(err, people){
    var repNames = [];
    String.prototype.capitalize = function() {
      return this.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function(a) { return a.toUpperCase(); });
    };
    for(var i = 0; i < people.length; i++){
      repNames.push(people[i].name.capitalize());
    }
    res.send(repNames);
  });
});

// Get representative info from DB.
router.get('/repById/:id', function (req, res) {
  CongressPerson.findOne({id: req.params.id}, function (err, rep) {
    if (rep === null) return res.status(404).end("Representative not found!");

    res.send(rep);
  });
});

// Scrap representative data from the web. NOTE: Returns a string, not an array.
router.get('/bioById/:id', function (req, res) {
  scrapeBio(req.params.id)
  .then(function(bio) {
    res.send(bio[0]);
  })
  .catch(function() {
    res.status(404).end("Bio not found.");
  });
});

// Legacy call for getting individual congress members by name
router.get('/getOneMember/:name', function(req, res){
  CongressPerson.findOne({name: req.params.name.toLowerCase()}, function(err, person){
    if(person === null) {
      res.send(404, "person not found");
    } else {
    //Scrape the bio first
      scrapeBio(person.id)
      .then(function(bio) {
        console.log(bio);
        res.send({member: person, memberBio: bio});
      })
      .catch(function() {
        res.send({member: person});
      });
    }

  });
});

router.get('/byState/:state', function(req, res) {
  CongressPerson.find({state: req.params.state}, function(err, people){
    if (err) console.log(err);
    res.send(people);
  });
});



router.get('/user/:email', function(req, res) {
  User.findOne({email: req.params.email}, function (err, user) {
    if (err) console.log(err);
    res.send(user);
  });
});

router.post('/user/cacheSearch', function(req, res){
  User.findOne({_id: req.body._id}, function(err, user){
    if (!user) return res.status(404).end("User not found!");
    var currCache = user.searchCache;
    var duplicate = false;
    console.log(req.body.search);
    for(var i = 0; i < currCache.length; i++){
      if(currCache[i].id === req.body.search.id) duplicate = true;
    }
    if(!duplicate){
      currCache = [req.body.search].concat(currCache);
      if(currCache.length > 10){
        currCache.pop();
      }
      user.searchCache = currCache;
      user.save();
    }
    // console.log(currCache, ' the currCache');
    res.send(currCache);
  });
});

router.post('/user/:email', function (req, res) {
  User.findOne({email: req.params.email}, function (err, user) {
    if (err) return res.status(500).send('Internal Server Error.');
    if (!user) return res.status(404).send('User not found.');

    if (req.body.email) {
      User.findOne({email: req.body.email}, function (err, conflictingUser) {
        if (err) return res.status(500).send('Internal Server Error.');
        if (conflictingUser) return res.status(400).send('Email already in use.');

        res.send(saveToUser(user, req.body));
      });
    } else {
      res.send(saveToUser(user, req.body));
    }
  });
});

module.exports = router;