const express = require('express')
const router = express.Router()
const chalk = require('chalk')
const util = require('util')
var _ = require('lodash')
// const schema = require('./schema.js')
var Promise = require('bluebird')

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
      res.sendStatus(500).json(error)
    })
  })
  .then(() => {
    res.status(200).json(data)
  })
  .catch(error => {
    console.error(chalk.red('error getting recipes that feature a specifc material', JSON.stringify(error)))
    res.status(500).json(error)
  })
})

// add a new material
// TODO: add validation
router.post('/materials', (req, res) => {
  knex('materials').insert(req.body, 'id')
  .then(id => {
    res.status(200).json(id)
  })
  .catch(error => {
    console.error(chalk.red('error adding a new material', JSON.stringify(error)))
    res.status(500).json({ error: error.detail })
  })
})

// add a new recipe with ingredients (existing materials)
// TODO: add validation for ingredient IDs
router.post('/recipes', (req, res) => {
  let recipe = _.omit(req.body, 'ingredients')
  let { ingredients } = _.pick(req.body, 'ingredients')

  knex.transaction((trx) => {
    return trx
      .insert(recipe, 'id')
      .into('recipes')
      .then(ids => {
        return Promise.map(ingredients, (ingredient) => {
          let entry = {}
          entry.recipe_id = ids[0]
          entry.material_id = ingredient.id
          entry.quantity = ingredient.quantity
          return trx.insert(entry).into('ingredients')
        })
      })
  })
  .then(inserts => {
    res.status(200).json({ msg: `successfully added new recipe and ${inserts.length} ingredients` })
  })
  .catch(error => {
    console.error(chalk.red('error adding a new recipe', JSON.stringify(error.detail)))
    res.status(500).json({ error: error.detail })
  })
})

// update a particular material
router.patch('/materials/:id', (req, res) => {
  const { id } = req.params
  knex('materials').where('id', id)
  .update(req.body, 'id')
  .then(ids => {
    return knex('materials').where('id', ids[0])
  })
  .then(materials => {
    res.status(200).json(materials)
  })
  .catch(error => {
    console.error(chalk.red('error updating a material', JSON.stringify(error)))
    res.status(500).json({ error: error.detail })
  })
})

// update a specific recipe
router.patch('/recipes/:id', (req, res) => {
  const { id } = req.params
  let recipe = _.omit(req.body, 'ingredients')
  let { ingredients } = _.pick(req.body, 'ingredients')
  console.log(recipe)

  if (!_.isEmpty(recipe) && ingredients.length > 0) {
    knex.transaction(trx => {
      trx('recipes').where('id', id).update(recipe, 'id').then(ids => {
        if (ingredients.length > 0) {
          return Promise.map(ingredients, ingredient => {
            return trx('ingredients')
              .where('recipe_id', ids[0])
              .andWhere('material_id', ingredient.id)
              .update(_.omit(ingredient, 'id'))
          })
        } else {
          trx.commit()
        }
      })
    })
    .then(() => {
      res
        .status(200)
        .json({ msg: `successfully updated recipe and/or its ingredients` })
    })
    .catch(error => {
      console.error(
        chalk.red(
          'error updating a recipe and/or its ingredients',
          JSON.stringify(error)
        )
      )
      res.status(500).json({ error: error })
    })
  } else if (ingredients.length > 0) {
    knex.transaction(trx => {
      return Promise.map(ingredients, ingredient => {
        return trx('ingredients')
          .where('recipe_id', id)
          .andWhere('material_id', ingredient.id)
          .update(_.omit(ingredient, 'id'))
      })
    })
    .then(() => {
      res.status(200).json({ msg: `successfully updated recipe ingredients` })
    })
    .catch(error => {
      console.error(
        chalk.red(
          'error updating a recipe\'s ingredients',
          JSON.stringify(error)
        )
      )
      res.status(500).json({ error: error })
    })
  } else {
    res.status(500).json({ error: `invalid body` })
  }
})

// delete a particular recipe
router.delete('/materials/:id', (req, res) => {

})

// delete a specific material
router.delete('/recipes/:id', (req, res) => {

})

module.exports = router
