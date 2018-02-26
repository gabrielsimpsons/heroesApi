const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')

var HeroSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlenght: 4,
    unique: true,
    trim: true
	},
	views: {
		type: Number,
		default: 0,
		required: true
	}
})

HeroSchema.methods.toJSON = function (){
	let hero = this;
	let heroObject = hero.toObject();
	return _.pick(heroObject, ['_id', 'name', 'views'])
}

let Hero = mongoose.model('Hero', HeroSchema)

module.exports = {Hero}