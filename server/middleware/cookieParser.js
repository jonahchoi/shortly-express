const parseCookies = (req, res, next) => {

  let cookies = {};

  if(!req.headers.cookie) {
    next();
  } else {
    const cookiesArray = req.headers.cookie.split(';');

    cookiesArray.forEach((cookie) => {
        const [key, value] = cookie.trim().split('=');
        cookies[key] = value;
    });

    req.cookies = cookies;
    next();
  }
};

module.exports = parseCookies;