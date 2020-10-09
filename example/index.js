var express = require('express');
var Keycloak = require('keycloak-connect');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var serveIndex = require('serve-index');

var app = express();
app.use(morgan('combined'));

const secret = 'mae7eiD0EeVao9th';
app.use(cookieParser());
app.use(session({ // keycloak-connect requires a session id
  secret: secret,
  resave: true,
  saveUninitialized: true,
  name: 'session'
}));

var keycloak = new Keycloak({
  cookies: true // only use for debugging - tokens will be accessible in the browser unencrypted
});
app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

const dir = '.';
app.use('/', keycloak.protect(), express.static(dir), serveIndex(dir));

app.listen(3000);
