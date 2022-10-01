const models = require('../models');
const Promise = require('bluebird');
const Sessions = models.Sessions;

module.exports.createSession = (req, res, next) => {
  if(req.cookies?.sessionId) {
    module.exports.verifySession(req.cookies)
      .then((isLoggedIn) => {
        if(isLoggedIn === null) {
          makeOneSess(res, next);
        } else {
          next();
        }
      })
  } else {
    makeOneSess(res, () => next());
  }
};

let makeOneSess = (res, callback) => {
  Sessions.create()
    .then((newSess) => {
      res.cookie('sessionId', `${newSess.insertId}`);
      callback();
    })
    .catch((err) => console.log('hi'));
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