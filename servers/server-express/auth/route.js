const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('./controller')

// -----------------------------------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------------------------------

// Get all accounts
router.get('/', auth.isWithToken, auth.getInfo)

// SIGN UP
// Require email, name, username, passsword
router.post('/signup', auth.isAccountExist, auth.signup)

// SIGN IN
// Require username and passsword
router.post('/signin', auth.signin)

// SIGN OUT
// Not necessary if using different host/port
router.get('/signout', auth.isAuthenticated, auth.signout)
router.post('/signout', auth.isAuthenticated, auth.signout)

// -----------------------------------------------------------------------------
// VERIFICATION/INVITATION + RESET/CONFIRMATION
// -----------------------------------------------------------------------------

router.post('/signup/actions/verify', (req, res) => { res.status(501).json({m: `The account is successfully verified with that confirmation token.`}) })
router.post('/password/actions/reset', (req, res) => { res.status(501).json({m: `Password reset link has been sent to {email}.`}) })
router.post('/password/actions/confirm', (req, res) => { res.status(501).json({m: `Password has been changed. Please sign in with the new password.`}) })

// -----------------------------------------------------------------------------
// VALIDATOR
// -----------------------------------------------------------------------------

// IS WITH TOKEN?
// Require 'Authorization: Bearer JWT' (Optional)
router.get('/is-with-token', auth.isWithToken, (req, res) => { res.send(req.info) })
router.post('/is-with-token', auth.isWithToken, (req, res) => { res.send(req.info) })

// IS ACCOUNT EXIST?
// Require 'username'
router.post('/is-account-exist', auth.isAccountExist, (req, res) => { res.send({m: `Account with username '${req.body.username}' is available.`}) })

// IS AUTHENTICATED?
// Require 'Authorization: Bearer JWT'
router.post('/is-authenticated', auth.isAuthenticated, (req, res) => {
  res.send({
    decoded: {
      sub: req.decoded.sub,
      m: `Account with that token is authenticated.`
    }
  })
})

// IS ADMIN?
// Require 'Authorization: Bearer JWT' with Admin role
router.post('/is-admin', auth.isAdmin, (req, res) => { res.send({m: `Account with that token is an admin.`}) })

// IS WITH API KEY?
// Require 'X-API-Key: String'
router.post('/is-with-api-key', auth.isWithAPIKey, (req, res) => { res.send({m: `Accepted API Key: ${req.apikey}`}) })

// IS SETUP?
// Require 'X-API-Key: String' with setup secret
router.post('/is-setup', [auth.isWithAPIKey, auth.isSetup], (req, res) => { res.send({m: `Accepted as a setup environment.`}) })

// IS TEST?
// Require 'X-API-Key: String' with test secret
router.post('/is-test', [auth.isWithAPIKey, auth.isTest], (req, res) => { res.send({m: `Accepted as a test environment.`}) })

// -----------------------------------------------------------------------------
// OAUTH THIRD PARTY
// -----------------------------------------------------------------------------
// There's no actual controller here since for each API endpoint,
// they're only calling authentication through Passport.
//
// Primarily:
// 1. Auth with OAuth provider
// 2. Get access token from that
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// GITHUB
// -----------------------------------------------------------------------------

router.get('/github', auth.isWithToken, passport.authenticate('github'))
router.get('/github/callback', auth.isWithToken, passport.authenticate('github'))

// -----------------------------------------------------------------------------
// FACEBOOK
// -----------------------------------------------------------------------------

router.get('/facebook', auth.isWithToken, passport.authenticate('facebook', {
  scope: ['email']
}))
router.get('/facebook/callback', auth.isWithToken, passport.authenticate('facebook'))

// -----------------------------------------------------------------------------
// TWITTER
// -----------------------------------------------------------------------------

router.get('/twitter', auth.isWithToken, passport.authenticate('twitter'))
router.get('/twitter/callback', auth.isWithToken, passport.authenticate('twitter')
)

// -----------------------------------------------------------------------------
// GOOGLE
// -----------------------------------------------------------------------------

router.get('/google', auth.isWithToken, passport.authenticate('google', {
  scope: ['profile', 'email']
}))
router.get('/google/callback', auth.isWithToken, passport.authenticate('google'))

// -----------------------------------------------------------------------------

module.exports = router
