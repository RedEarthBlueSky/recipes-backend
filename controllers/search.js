'use strict';

const Recipe = require('../models').models.Recipe;
const axios = require("../lib/axios");

exports.getSearchRecipes = function* (next) {
  this.type = 'json';
  const id = this.params.id;
  let yummlyRecipes = [];

	try {
		const recipes = yield Recipe.find({name: new RegExp(id,"i")});
		if (recipes.length > 0) {
      this.status = 200;
      this.body = {
        recipes: recipes
      };
    } else {
      let recipes = yield axios.get('/recipes', {
        params: { q: `${id}`}
      }).then(function(res) {
        const matches = res.data.matches;
        for (let i = 0; i < 5; i++) {
          let newRecipe = {
            id: matches[i].id,
            name: matches[i].recipeName,
            image_url: matches[i].imageUrlsBySize['90'],
            time: Math.ceil(matches[i].totalTimeInSeconds/60)
          }
          yummlyRecipes.push(newRecipe);
        }
        return yummlyRecipes;
      });
      this.status = 200;
      this.body = {
        recipes: recipes
      };
    }
	} catch (err) {
		console.log('no recipes matching search criteria');
    this.status = 401;
    this.body = err;
  }
};
