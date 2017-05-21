const JSONAPISerializer = require('jsonapi-serializer').Serializer

var MaterialSerializer = new JSONAPISerializer('materials', {
  topLevelLinks: {
    self: '/api/v1/materials',
  },
  attributes: [
    'name',
    'category',
    'type',
    'effect',
    'potency',
    'hearts',
    'value',
    'duration',
  ],
})


var RecipeSerializer = new JSONAPISerializer('recipes', {
  topLevelLinks: {
    self: '/api/v1/recipes',
  },
  attributes: ['name', 'category', 'notes', 'hearts', 'value', 'ingredients'],
  ingredients: {
    attributes: [
      'id',
      'quantity',
      'name',
      'category',
      'type',
      'effect',
      'potency',
      'hearts',
      'value',
      'duration',
    ],
  },
})


module.exports = { MaterialSerializer, RecipeSerializer }
