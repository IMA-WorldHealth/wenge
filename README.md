Wenge
=====

[![Circle CI](https://circleci.com/gh/IMA-WorldHealth/wenge.svg?style=shield)](https://circleci.com/gh/IMA-WorldHealth/wenge)
[![Code Climate](https://codeclimate.com/github/IMA-WorldHealth/wenge/badges/gpa.svg)](https://codeclimate.com/github/IMA-WorldHealth/wenge)


Wenge is a web application for creating, reviewing, and approving Authorizations for Expenditure (AFEs).
This is an experimental application written to transition the IMA World Health office in
Kinshasa to a paperless AFE system.

### Installation

You need [nodejs](https://nodejs.org) and [sqlite3](https://www.sqlite.org/).  To install, use npm.
```sh
npm install -g gulp bower
npm install
bower install
npm run app
```

The application depends on `.env` which is not distributed with this repository.  To create your own,
please follow the guidelines in `.env.sample`.  Otherwise, email the developers [developers@imaworldhealth.org](<developers@imaworldhealth.org>)

### Testing

To test the application, use npm.
```sh
npm test
```

### Version 1 Feature Set
 1. CRUD for users
 2. CRUD for projects
 3. CRUD for requests
 4. PKI-based signatures and verification
 5. Printable requests with custom headers
 6. Basic email functionality
   1. Password reset
   2. Signup/welcome
   3. Pending authorizations
   4. Notification of authorization

### Development Progress
 - [x] Implement project management
 - [x] Automatic database builds
 - [x] Automatic testing
 - [X] Development/production environmental variable switch
 - [ ] Implement email-based signin (tokens)
 - [ ] Full HTTP API tests written using `mocha`/`chai-http`
 - [ ] Automatic deployment using [CircleCI](https://circleci.com/)
 - [ ] HTTPS certificates using [LetsEncrypt](https://letsencrypt.org/)

### LICENSE
[MIT](./LICENSE)
