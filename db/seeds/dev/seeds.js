const recipes = require('../../../data/recipes.json')
const materials = require('../../../data/materials.json')
const ingredients = require('../../../data/ingredients.json')

exports.seed = function (knex, Promise) {
  return knex('ingredients').del()
    .then(function () {
      return knex('materials').del()
    })
    .then(function () {
      return knex('recipes').del()
    })
    .then(function () {
      return knex('materials').insert(materials)
    })
    .then(function () {
      return knex('recipes').insert(recipes)
    })
    .then(function () {
      return knex('ingredients').insert(ingredients)
    })
}
