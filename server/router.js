const express = require('express')
const router = express.Router()
const chalk = require('chalk')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const knex = require('knex')(configuration)

// get all materials
router.get('/materials', (req, res) => {
  knex('materials').select()
    .then(materials => {
      res.status(200).json(materials)
    })
    .catch(error => {
      console.error(chalk.red('error getting all materials', JSON.stringify(error)))
      res.sendStatus(500).json(error)
    })
})

// get a specific material
router.get('/materials/:id', (req, res) => {
  const { id } = req.params
  knex('materials').select().where('id', id)
    .then(materials => {
      res.status(200).json(materials)
    })
    .catch(error => {
      console.error(chalk.red('error getting all materials', JSON.stringify(error)))
      res.sendStatus(500).json(error)
    })
})

// get all recipes
router.get('/recipes', (req, res) => {
  let data = []

  knex('recipes').select()
  .then(recipes => {
    return Promise.all(
      recipes.map(recipe => {
        return knex('ingredients')
        .select('quantity')
        .where('recipe_id', recipe.id)
        .join('materials', 'ingredients.material_id', '=', 'materials.id')
        .select('materials.*')
        .tap(recipeIngredients => {
          Object.assign(recipe, { ingredients: recipeIngredients })
          data.push(recipe)
        })
      })
    )
  })
  .then(() => {
    res.status(200).json(data)
  })
})

// get a specific recipe
router.get('/recipes/:id', (req, res) => {
  const { id } = req.params
  let data = {}

  knex('recipes').where('id', id)
  .then(recipe => {
    Object.assign(data, recipe[0])
    return knex('ingredients')
    .select('quantity')
    .where('recipe_id', id)
    .join('materials', 'ingredients.material_id', '=', 'materials.id')
    .select('materials.*')
  })
  .then(ingredients => {
    Object.assign(data, { ingredients })
    res.status(200).json(data)
  })
  .catch(error => {
    console.error(chalk.red('error getting one recipe', JSON.stringify(error)))
    res.sendStatus(500).json(error)
  })
})

// get all materials (ingredients) for a particular recipe
router.get('/recipes/:id/materials', (req, res) => {
  const { id } = req.params

  knex('ingredients')
  .select('quantity')
  .where('recipe_id', id)
  .join('materials', 'ingredients.material_id', '=', 'materials.id')
  .select('materials.*')
  .then(ingredients => {
    res.status(200).json(ingredients)
  })
  .catch(error => {
    console.error(chalk.red('error getting materials for one recipe', JSON.stringify(error)))
    res.sendStatus(500).json(error)
  })
})

// get all recipes that feature a specific material
router.get('/materials/:id/recipes', (req, res) => {
  const { id } = req.params
  let data = []

  knex('ingredients')
  // .select('quantity')
  .where('material_id', id)
  .join('recipes', 'ingredients.recipe_id', '=', 'recipes.id')
  .select('recipes.*')
  .then(recipes => {
    // res.status(200).json(recipes)
    return Promise.all(
      recipes.map(recipe => {
        return knex('ingredients').select('quantity')
        .where('recipe_id', recipe.id)
        .join('materials', 'ingredients.material_id', '=', 'materials.id')
        .select('materials.*')
        .tap(recipeIngredients => {
          Object.assign(recipe, { ingredients: recipeIngredients })
          data.push(recipe)
        })
      })
    )
    .catch(error => {
      console.error(chalk.red('error', error))
    })
  })
  .then(() => {
    res.status(200).json(data)
  })
  .catch(error => {
    console.error(chalk.red('error getting recipes that feature a specifc material', JSON.stringify(error)))
    res.sendStatus(500).json(error)
  })
})

// add a new material
router.post('/materials', (req, res) => {

})

// add a new recipe with ingredients (existing materials)
router.post('/recipes', (req, res) => {

})

// update a particular material
router.patch('/materials/:id', (req, res) => {

})

// update a specific recipe
router.patch('/recipes/:id', (req, res) => {

})

// delete a particular recipe
router.delete('/materials/:id', (req, res) => {

})

// delete a specific material
router.delete('/recipes/:id', (req, res) => {

})

module.exports = router
