const express = require('express')
const router = express.Router()
const chalk = require('chalk')
const _ = require('lodash')
const Promise = require('bluebird')
const { MaterialSerializer, RecipeSerializer } = require('./serializer')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const knex = require('knex')(configuration)

// get all materials
router.get('/materials', (req, res) => {
  knex('materials')
    .select(
      'id',
      'name',
      'category',
      'type',
      'effect',
      'potency',
      'hearts',
      'value',
      'duration'
    )
    .modify(qb => {
      if (!_.isEmpty(req.query)) {
        // only filters based on the first query
        const key = _.keys(req.query)[0]
        let value = req.query[key]
        if (_.includes(['id', 'value', 'duration'], key)) {
          value = parseInt(value, 10)
          qb.where(`materials.${key}`, value)
        } else if (key === 'hearts') {
          value = parseFloat(value)
          qb.where(`materials.${key}`, value)
        } else {
          value = value.toLowerCase()
          qb.whereRaw(`lower(${key}) = ?`, value)
            .andWhere('deleted', false)
        }
      } else {
        qb.where('deleted', false)
      }
    })
    .then(materials => {
      res.status(200).json(MaterialSerializer.serialize(materials))
    })
    .catch(error => {
      console.error(
        chalk.red('error getting all materials', JSON.stringify(error))
      )
      res.sendStatus(500).json(error)
    })
})

// get a specific material
router.get('/materials/:id', (req, res) => {
  const { id } = req.params
  knex('materials')
    .select(
      'id',
      'name',
      'category',
      'type',
      'effect',
      'potency',
      'hearts',
      'value',
      'duration'
    )
    .where('id', id)
    .andWhere('deleted', false)
    .then(materials => {
      if (materials.length === 0) {
        res.sendStatus(404)
      } else {
        res.status(200).json(MaterialSerializer.serialize(materials))
      }
    })
    .catch(error => {
      console.error(
        chalk.red('error getting all materials', JSON.stringify(error))
      )
      res.sendStatus(500).json(error)
    })
})

// get all recipes
router.get('/recipes', (req, res) => {
  let data = []

  knex('recipes')
    .select('id', 'name', 'category', 'notes', 'hearts', 'value')
    .where('deleted', false)
    .then(recipes => {
      return Promise.all(
        recipes.map(recipe => {
          return knex('ingredients')
            .select('quantity')
            .where('recipe_id', recipe.id)
            .andWhere('ingredients.deleted', false)
            .join('materials', 'ingredients.material_id', '=', 'materials.id')
            .select(
              'id',
              'name',
              'category',
              'type',
              'effect',
              'potency',
              'hearts',
              'value',
              'duration'
            )
            .tap(recipeIngredients => {
              Object.assign(recipe, { ingredients: recipeIngredients })
              data.push(recipe)
            })
        })
      )
    })
    .then(() => {
      res.status(200).json(RecipeSerializer.serialize(data))
    })
})

// get a specific recipe
router.get('/recipes/:id', (req, res) => {
  const { id } = req.params
  let data = {}

  knex('recipes')
    .select('id', 'name', 'category', 'notes', 'hearts', 'value')
    .where('id', id)
    .andWhere('deleted', false)
    .then(recipe => {
      Object.assign(data, recipe[0])
      return knex('ingredients')
        .select('quantity')
        .where('recipe_id', id)
        .andWhere('ingredients.deleted', false)
        .join('materials', 'ingredients.material_id', '=', 'materials.id')
        .select(
          'id',
          'name',
          'category',
          'type',
          'effect',
          'potency',
          'hearts',
          'value',
          'duration'
        )
    })
    .then(ingredients => {
      if (ingredients.length > 0) {
        Object.assign(data, { ingredients })
      }
      if (_.isEmpty(data)) {
        res.sendStatus(404)
      } else {
        res.status(200).json(RecipeSerializer.serialize(data))
      }
    })
    .catch(error => {
      console.error(chalk.red('error getting one recipe', error))
      res.status(500).json(error)
    })
})

// get all materials (ingredients) for a particular recipe
router.get('/recipes/:id/materials', (req, res) => {
  const { id } = req.params

  knex('ingredients')
    .select('quantity')
    .where('recipe_id', id)
    .andWhere('ingredients.deleted', false)
    .join('materials', 'ingredients.material_id', '=', 'materials.id')
    .select(
      'id',
      'name',
      'category',
      'type',
      'effect',
      'potency',
      'hearts',
      'value',
      'duration'
    )
    .then(materials => {
      if (materials.length > 0) {
        res.status(200).json(MaterialSerializer.serialize(materials))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(error => {
      console.error(
        chalk.red(
          'error getting materials for one recipe',
          JSON.stringify(error)
        )
      )
      res.sendStatus(500).json(error)
    })
})

// get all recipes that feature a specific material
router.get('/materials/:id/recipes', (req, res) => {
  const { id } = req.params
  let data = []

  knex('ingredients')
    .where('material_id', id)
    .join('recipes', 'ingredients.recipe_id', '=', 'recipes.id')
    .select('id', 'name', 'category', 'notes', 'hearts', 'value')
    .where('recipes.deleted', false)
    .then(recipes => {
      return Promise.all(
        recipes.map(recipe => {
          return knex('ingredients')
            .select('quantity')
            .where('recipe_id', recipe.id)
            .andWhere('ingredients.deleted', false)
            .join('materials', 'ingredients.material_id', '=', 'materials.id')
            .select(
              'id',
              'name',
              'category',
              'type',
              'effect',
              'potency',
              'hearts',
              'value',
              'duration'
            )
            .tap(recipeIngredients => {
              Object.assign(recipe, { ingredients: recipeIngredients })
              data.push(recipe)
            })
        })
      ).catch(error => {
        console.error(chalk.red('error', error))
        res.sendStatus(500).json(error)
      })
    })
    .then(() => {
      if (data.length > 0) {
        res.status(200).json(RecipeSerializer.serialize(data))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(error => {
      console.error(
        chalk.red(
          'error getting recipes that feature a specifc material',
          error
        )
      )
      res.status(500).json(error)
    })
})

// add a new material
// TODO: add validation
router.post('/materials', (req, res) => {
  knex('materials')
    .insert(req.body, 'id')
    .then(ids => {
      res.location('/api/v1/materials/' + ids[0])
      return knex('materials')
      .select(
        'id',
        'name',
        'category',
        'type',
        'effect',
        'potency',
        'hearts',
        'value',
        'duration'
      )
      .where('id', ids[0])
      .andWhere('deleted', false)
    })
    .then((materials) => {
      res.status(201).json(MaterialSerializer.serialize(materials))
    })
    .catch(error => {
      res.status(500).json({ error: error.detail })
    })
})

// add a new recipe with ingredients (existing materials)
// TODO: add validation for ingredient IDs
router.post('/recipes', (req, res) => {
  let recipe = _.omit(req.body, 'ingredients')
  let { ingredients } = _.pick(req.body, 'ingredients')
  let recipeId = []
  let data = {}

  knex
    .transaction(trx => {
      return trx.insert(recipe, 'id').into('recipes').then(ids => {
        recipeId = ids[0]
        res.location('/api/v1/recipes/' + ids[0])
        return Promise.map(ingredients, ingredient => {
          let entry = {}
          entry.recipe_id = ids[0]
          entry.material_id = ingredient.id
          entry.quantity = ingredient.quantity
          return trx.insert(entry).into('ingredients')
        })
      })
    })
    .then(inserts => {
      return knex('recipes')
        .select('id', 'name', 'category', 'notes', 'hearts', 'value')
        .where('id', recipeId)
        .andWhere('deleted', false)
    })
    .then(recipe => {
      Object.assign(data, recipe[0])
      return knex('ingredients')
        .select('quantity')
        .where('recipe_id', recipeId)
        .andWhere('ingredients.deleted', false)
        .join('materials', 'ingredients.material_id', '=', 'materials.id')
        .select(
          'id',
          'name',
          'category',
          'type',
          'effect',
          'potency',
          'hearts',
          'value',
          'duration'
        )
    })
    .then(ingredients => {
      Object.assign(data, { ingredients })
      if (data.ingredients.length === 0) {
        res.status(201).json(RecipeSerializer.serialize(data))
      } else {
        res.status(201).json(RecipeSerializer.serialize(data))
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.detail })
    })
})

// update a particular material
router.patch('/materials/:id', (req, res) => {
  const { id } = req.params
  knex('materials')
    .where('id', id)
    .update(_.omit(req.body, 'id'), 'id')
    .then(ids => {
      if (ids[0]) {
        return knex('materials').where('id', ids[0])
      } else {
        return Promise.resolve([])
      }
    })
    .then(materials => {
      if (materials.length > 0) {
        res.status(200).json(MaterialSerializer.serialize(materials))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(error => {
      console.error(
        chalk.red('error updating a material', error)
      )
      res.status(500).json({ error: error.detail })
    })
})

// update a specific recipe
router.patch('/recipes/:id', (req, res) => {
  const { id } = req.params
  let recipe = _.omit(req.body, ['ingredients', 'id'])
  let { ingredients } = _.pick(req.body, 'ingredients')
  let data = {}
  let done = false

  knex('recipes').where('id', id)
  .then(recipes => {
    if (recipes.length === 0) {
      done = true
    }
  })

  if (done) {
    res.status(404).end()
    return
  }

  if (!_.isEmpty(recipe) && ingredients && ingredients.length > 0) {
    knex
      .transaction(trx => {
        trx('recipes').where('id', id).update(recipe, 'id').then(ids => {
          if (ingredients.length > 0) {
            return Promise.map(ingredients, ingredient => {
              return trx('ingredients')
                .where('recipe_id', id)
                .andWhere('material_id', ingredient.id)
                .update(_.omit(ingredient, 'id'))
            })
          } else {
            trx.commit()
          }
        })
      })
      .then(inserts => {
        return knex('recipes')
          .select('id', 'name', 'category', 'notes', 'hearts', 'value')
          .where('id', id)
          .andWhere('deleted', false)
      })
      .then(recipe => {
        Object.assign(data, recipe[0])
        return knex('ingredients')
          .select('quantity')
          .where('recipe_id', id)
          .andWhere('ingredients.deleted', false)
          .join('materials', 'ingredients.material_id', '=', 'materials.id')
          .select(
            'id',
            'name',
            'category',
            'type',
            'effect',
            'potency',
            'hearts',
            'value',
            'duration'
          )
      })
      .then(ingredients => {
        Object.assign(data, { ingredients })
        if (data.ingredients.length === 0) {
          res.status(200).json(RecipeSerializer.serialize([]))
        } else {
          res.status(200).json(RecipeSerializer.serialize(data))
        }
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
  } else if (ingredients && ingredients.length > 0) {
    knex
      .transaction(trx => {
        return Promise.map(ingredients, ingredient => {
          return trx('ingredients')
            .where('recipe_id', id)
            .andWhere('material_id', ingredient.id)
            .update(_.omit(ingredient, 'id'))
        })
      })
      .then(inserts => {
        return knex('recipes')
          .select('id', 'name', 'category', 'notes', 'hearts', 'value')
          .where('id', id)
          .andWhere('deleted', false)
      })
      .then(recipe => {
        Object.assign(data, recipe[0])
        return knex('ingredients')
          .select('quantity')
          .where('recipe_id', id)
          .andWhere('ingredients.deleted', false)
          .join('materials', 'ingredients.material_id', '=', 'materials.id')
          .select(
            'id',
            'name',
            'category',
            'type',
            'effect',
            'potency',
            'hearts',
            'value',
            'duration'
          )
      })
      .then(ingredients => {
        Object.assign(data, { ingredients })
        if (data.ingredients.length === 0) {
          res.status(200).json(RecipeSerializer.serialize([]))
        } else {
          res.status(200).json(RecipeSerializer.serialize(data))
        }
      })
      .catch(error => {
        console.error(
          chalk.red(
            "error updating a recipe's ingredients",
            JSON.stringify(error)
          )
        )
        res.status(500).json({ error: error })
      })
  } else if (!_.isEmpty(recipe)) {
    knex('recipes')
      .where('id', id)
      .update(recipe, 'id')
      .then(ids => {
        return knex('recipes')
          .select('id', 'name', 'category', 'notes', 'hearts', 'value')
          .where('id', id)
          .andWhere('deleted', false)
      })
      .then(recipe => {
        Object.assign(data, recipe[0])
        return knex('ingredients')
          .select('quantity')
          .where('recipe_id', id)
          .andWhere('ingredients.deleted', false)
          .join('materials', 'ingredients.material_id', '=', 'materials.id')
          .select(
            'id',
            'name',
            'category',
            'type',
            'effect',
            'potency',
            'hearts',
            'value',
            'duration'
          )
      })
      .then(ingredients => {
        Object.assign(data, { ingredients })
        if (data.ingredients.length === 0) {
          res.status(200).json(RecipeSerializer.serialize([]))
        } else {
          res.status(200).json(RecipeSerializer.serialize(data))
        }
      })
  } else {
    res.status(500)
  }
})

// delete a particular material (soft delete)
router.delete('/materials/:id', (req, res) => {
  const { id } = req.params
  knex('materials')
    .where('id', id)
    .update({ deleted: true }, 'id')
    .then(ids => {
      if (ids.length > 0) {
        res.sendStatus(204)
      } else {
        res.sendStatus(404)
      }
    })
    .catch(error => {
      console.error(
        chalk.red('error deleting a material', JSON.stringify(error))
      )
      res.status(500).json(error)
    })
})

// delete a specific recipe (soft delete)
router.delete('/recipes/:id', (req, res) => {
  const { id } = req.params
  knex
    .transaction(trx => {
      return trx('ingredients')
        .where('recipe_id', id)
        .update({ deleted: true }, 'material_id')
        .then((ids) => {
          return trx('recipes').where('id', id).update({ deleted: true }, 'id')
        })
    })
    .then((ids) => {
      if (ids.length > 0) {
        res.sendStatus(204)
      } else {
        res.sendStatus(404)
      }
    })
    .catch(error => {
      console.error(chalk.red('error deleting a recipe', error))
      res.status(500).json(error)
    })
})

module.exports = router
