const models = require('../models');
const Promise = require('bluebird');
const Sessions = models.Sessions;

module.exports.createSession = (req, res, next) => {
  req.session = {};

  if(req.cookies?.sessionId) {
    module.exports.verifySession(req.cookies)
      .then((isLoggedIn) => {
        if(isLoggedIn === null) {
          makeOneSess(req, res, next);
        } else {
          models.Sessions.get({id: req.cookies.sessionId})
            .then((sess) => {
              req.session.hash = sess.hash;
              return models.Users.get({id: sess.userId})
            })
            .then((user) => {
              req.session.user.username = user.username;
              req.session.userId = user.id;
              next();
            })
            .catch((err) => {
              console.error(err);
              next()
            })
        }
      })
  } else {
    makeOneSess(req, res, next);
  }
};

let makeOneSess = (req, res, callback) => {
  Sessions.create()
    .then((newSess) => {
      res.cookie('sessionId', `${newSess.insertId}`);
      models.Sessions.get({id: newSess.insertId})
        .then((sess) => {
          req.session.hash = sess.hash;
          callback();
        })
        .catch((err) => {
          console.error(err);
          callback();
        })
    })
    .catch((err) => {console.log(err); callback();});
}
/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
module.exports.verifySession = (cookies) => {
  return Sessions.get({ id: cookies?.sessionId })
    .then((queriedSess) => {
      if(!queriedSess) {
        return null;
      }
      let isLoggedIn = Sessions.isLoggedIn(queriedSess);
      if(!isLoggedIn) {
        return false;
      } else {
        return true;
      }
    })
    .catch((err) => console.error(err));
}