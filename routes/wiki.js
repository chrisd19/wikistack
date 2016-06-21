var express = require('express');
var router = express.Router();
var models = require('../models');

var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  Page.findAll().then(function(arrayOfPages) {
    res.render("index", {pages: arrayOfPages});
  });
});

router.post('/', function(req, res, next) {

  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .then(function(result) {
    var user = result[0];

    var page = Page.build({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      tags: req.body.tags.split(' ')
    });

    return page.save().then(function(page) {
      return page.setAuthor(user);
    });
  })
  .then(function(page) {
    res.redirect(page.route);
  })
  .catch(next);

});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/search', function(req, res, next) {
  if (req.query.tag) {
    Page.findAll( {
      where: {
        tags: {
          $overlap: req.query.tag.split(" ")
        }
      }
    }).then(function(pages) {
      console.log(pages);
      res.render("index", {pages: pages});
    })
  } else {
    res.render("search");
  }
});

router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  }).then(function(foundPage) {
    foundPage.getAuthor().then(function(user) {
      res.render("wikipage", {user: user, page: foundPage});
    })
  }).catch(next);

});




module.exports = router;
