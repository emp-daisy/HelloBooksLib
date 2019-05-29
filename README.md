# HelloBooksDef

[comment]: # (HoundCi Badge)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/emp-daisy/HelloBooksLib.svg?branch=develop)](https://travis-ci.org/emp-daisy/HelloBooksLib)
[![Coverage Status](https://coveralls.io/repos/github/emp-daisy/HelloBooksLib/badge.svg?branch=develop)](https://coveralls.io/github/emp-daisy/HelloBooksLib?branch=develop)

## Getting Started
---
### Installing

To run this application, you need to have Node.js, and git(to clone the repo) installed. Then follow the instructions to get
it up and running

- clone the repo and cd into the directory using

```shell
~> git clone https://github.com/emp-daisy/HelloBooksLib.git
~> cd HelloBooksLib
```

- run `npm install --prod` to install dependencies
- create a .env file from the .env.sample file and fill in the necessary environment variables
- run `npm run build` to build the project and then run `npm start` to start the server
- now access the server on the localhost port you specify e.g `localhost:5000 or 127.0.0.1:5000`

Now the server will go live and listen for requests

## Developing

To develop the app further, a few handy tools have been put in place such as nodemon and some other dev dependencies.
Access them by starting the server using `npm run dev`. But before using the command, make sure to follow the steps below

```shell
git clone https://github.com/emp-daisy/HelloBooksLib.git
cd HelloBooksLib/
npm install
npm run dev
```

### Building

The app is written in ES6+ and wired to run ES5 transpiled code in production. To transpile any changes to ES5 run the script shown below

```shell
npm run build
```
Babel then transpiles your ES6+ files to ES5 for environment compatibility
