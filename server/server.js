const path = require('path')
const express = require('express')
const url = require('url')
const cors = require('cors')
const bodyParser = require('body-parser')
const _ = require('lodash')
const {ObjectID} = require('mongodb')
var {authorize} = require('./middleware/authenticate')


var app = express()

var {Hero} = require('./models/hero')
var {mongoose} = require('./db/mongoose')

const APP_PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var originsWhitelist = [
  'http://localhost:4200',      //this is my front-end url for development
   'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}
//here is the magic
app.use(cors(corsOptions))

app.get('/about',cors, (req, res) => {
  res.send('<h1>About page</h1>')
})

app.get('/bad',cors, (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  })
})

app.post('/api/heroes', authorize, (req, res) => {
	let body = _.pick(req.body, ['name'])
  console.log(`Adding new hero-> ${JSON.stringify(body, undefined, 2)}`)
	let hero = new Hero(body)
	hero.save().then(() => {
		res.send(hero)
	}).catch(error => {
		console.log(`Error guardando el héroe ${JSON.stringify(error)}`)
      res.status(400).send({
        code: 2000,
        message: 'Error guardando usuario',
        error
      })
	})
})

app.get('/api/heroes/:id', authorize, (req, res) => {
	console.log(`id: ${req.params.id}`)
	if(!ObjectID.isValid(req.params.id)){
    res.status(400).send({message: 'Is not an valid id'})
  }
  Hero.findById(req.params.id).then(hero => {
  	if(!hero)
  		res.status(400).send('Heroe no encontrado')
  	hero.views += 1
  	hero.save().then(() => res.send(hero))
  		.catch(err => res.status(400).send({mensaje: error}))
  }).catch(error => res.status(400).send({mensaje: error}))
})

app.put('/api/heroes/:id', authorize, (req, res) => {
	console.log(`updating hero id: ${req.params.id}`)
	let body = _.pick(req.body, ['name'])
	if(!ObjectID.isValid(req.params.id)){
    res.status(400).send({message: 'Is not an valid id'})
  }
  Hero.findById(req.params.id)
  	.then(hero => {
			hero.name = body.name
			hero.save().then(() => {
				res.send(hero)
			}).catch(error => res.status(400).send(error))
		}).catch(error => res.status(400).send(error))
})

app.delete('/api/heroes/:id', authorize, (req, res) => {
	console.log(`id: ${req.params.id}`)
	let body = _.pick(req.body, ['name'])
	if(!ObjectID.isValid(req.params.id)){
    res.status(400).send({message: 'Is not an valid id'})
  }
  Hero.findById(req.params.id)
  	.then(hero => {
			hero.name = body.name
			hero.remove().then(() => {
				res.send(hero)
			}).catch(error => res.status(400).send(error))
		}).catch(error => res.status(400).send(error))
})

app.get('/api/heroes', authorize, (req, res) => {
  console.log(`query: ${JSON.stringify(req.query)}`)
  if(req.query){
    let query = {}
    if(req.query.name){
      let name = req.query.name.split(' ')
      if(Array.isArray(name)){
        query.name = {
          $in: name
        }
      } else {
        query.name = name
      }
      /*query.name = req.query.name*/
    }
    console.log(`Query final: ${JSON.stringify(query, 2, undefined)}`)
    Hero.find(query)
      .then(heroes => res.send(heroes))
      .catch(error => res.status(400).send(error))
  } else {
    Hero.find({})
    .then(heroes => res.send(heroes))
    .catch(error => res.status(400).send(error))
  }
	
})

app.listen(APP_PORT, () => {
  console.log(`Server is up on port ${APP_PORT}`)
})
