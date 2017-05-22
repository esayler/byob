/* eslint-env mocha */
/* eslint no-unused-vars: 0, no-unused-expressions: 0 */

process.env.NODE_ENV = 'test'
const config = require('../knexfile.js')['test']
const knex = require('knex')(config)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const assert = chai.assert
const should = chai.should()
const app = require('../server')
const util = require('util')

chai.use(chaiHttp)

describe('Server', () => {
  it('should exist', () => {
    expect(app).to.exist
  })
})

describe('API Routes', () => {
  before(() => {
    return knex.migrate.latest()
  })

  beforeEach(() => {
    return knex.seed.run()
  })

  // get all recipes
  describe('GET /api/v1/recipes', () => {
    it('should return all recipes', () => {
      return chai
        .request(app)
        .get('/api/v1/recipes')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.an('object')
          res.body.data.should.be.an('array')
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('recipes')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('notes')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('hearts')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('value')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('ingredients')
            .that.is.a('array')
          res.body.data[0].attributes.ingredients[0].should.have.property('quantity')
            .that.is.a('number')
          res.body.data[0].attributes.ingredients[0].should.have.property('id')
            .that.is.a('number')
          res.body.data[0].attributes.ingredients[0].should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.ingredients[0].should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.ingredients[0].should.have.property('type')
          res.body.data[0].attributes.ingredients[0].should.have.property('effect')
          res.body.data[0].attributes.ingredients[0].should.have.property('potency')
          res.body.data[0].attributes.ingredients[0].should.have.property('hearts')
          res.body.data[0].attributes.ingredients[0].should.have.property('value')
          res.body.data[0].attributes.ingredients[0].should.have.property('duration')
          res.body.data[0].attributes.ingredients[0].should.not.have.property('created_at')
          res.body.data[0].attributes.ingredients[0].should.not.have.property('updated_at')
          res.body.data[0].attributes.should.not.have.property('created_at')
          res.body.data[0].attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })
  })

  // get all materials
  describe('GET /api/v1/materials', () => {
    it('should return all materials', () => {
      return chai
        .request(app)
        .get('/api/v1/materials')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.an('object')
          res.body.data.should.be.an('array')
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('materials')
          res.body.data[0].attributes.should.not.have.property('quantity')
            .that.is.a('number')
          res.body.data[0].attributes.should.not.have.property('id')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('type')
          res.body.data[0].attributes.should.have.property('effect')
          res.body.data[0].attributes.should.have.property('potency')
          res.body.data[0].attributes.should.have.property('hearts')
          res.body.data[0].attributes.should.have.property('value')
          res.body.data[0].attributes.should.have.property('duration')
          res.body.data[0].attributes.should.not.have.property('created_at')
          res.body.data[0].attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })
  })

  // get a specific material
  describe('GET /api/v1/materials/:id', () => {
    it('should return a specifc material', () => {
      return chai
        .request(app)
        .get('/api/v1/materials/1')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.data.should.be.a('array')
          res.body.data.length.should.equal(1)
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('materials')
          res.body.data[0].attributes.should.not.have.property('quantity')
            .that.is.a('number')
          res.body.data[0].attributes.should.not.have.property('id')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('type')
          res.body.data[0].attributes.should.have.property('effect')
          res.body.data[0].attributes.should.have.property('potency')
          res.body.data[0].attributes.should.have.property('hearts')
          res.body.data[0].attributes.should.have.property('value')
          res.body.data[0].attributes.should.have.property('duration')
          res.body.data[0].attributes.should.not.have.property('created_at')
          res.body.data[0].attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('should return 404 if the the material doesn\'t exist', () => {
      return chai
        .request(app)
        .get('/api/v1/materials/999')
        .then(res => {
          res.should.have.status(404)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })

  // get a specific recipe
  describe('GET /api/v1/recipes/:id', () => {
    it('should return a specifc recipe', () => {
      return chai
        .request(app)
        .get('/api/v1/recipes/1')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.an('object')
          res.body.data.should.be.an('object')
          res.body.data.should.have.property('id')
            .that.is.a('string')
          res.body.data.should.have.property('type')
            .that.is.a('string')
            .that.equals('recipes')
          res.body.data.attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data.attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data.attributes.should.have.property('notes')
            .that.is.a('string')
          res.body.data.attributes.should.have.property('hearts')
            .that.is.a('number')
          res.body.data.attributes.should.have.property('value')
            .that.is.a('number')
          res.body.data.attributes.should.have.property('ingredients')
            .that.is.a('array')
          res.body.data.attributes.ingredients[0].should.have.property('quantity')
            .that.is.a('number')
          res.body.data.attributes.ingredients[0].should.have.property('id')
            .that.is.a('number')
          res.body.data.attributes.ingredients[0].should.have.property('name')
            .that.is.a('string')
          res.body.data.attributes.ingredients[0].should.have.property('category')
            .that.is.a('string')
          res.body.data.attributes.ingredients[0].should.have.property('type')
          res.body.data.attributes.ingredients[0].should.have.property('effect')
          res.body.data.attributes.ingredients[0].should.have.property('potency')
          res.body.data.attributes.ingredients[0].should.have.property('hearts')
          res.body.data.attributes.ingredients[0].should.have.property('value')
          res.body.data.attributes.ingredients[0].should.have.property('duration')
          res.body.data.attributes.ingredients[0].should.not.have.property('created_at')
          res.body.data.attributes.ingredients[0].should.not.have.property('updated_at')
          res.body.data.attributes.should.not.have.property('created_at')
          res.body.data.attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('should return 404 if the the recipe doesn\'t exist', () => {
      return chai
        .request(app)
        .get('/api/v1/recipes/999')
        .then(res => {
          res.should.have.status(404)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })

  // get all of the materials for a specific recipe
  describe('GET /api/v1/recipes/:id/materials', () => {
    it('should return all materials belonging to a specific recipe', () => {
      return chai
        .request(app)
        .get('/api/v1/recipes/1/materials')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.an('object')
          res.body.data.should.be.an('array')
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('materials')
          res.body.data[0].attributes.should.not.have.property('quantity')
            .that.is.a('number')
          res.body.data[0].attributes.should.not.have.property('id')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('type')
          res.body.data[0].attributes.should.have.property('effect')
          res.body.data[0].attributes.should.have.property('potency')
          res.body.data[0].attributes.should.have.property('hearts')
          res.body.data[0].attributes.should.have.property('value')
          res.body.data[0].attributes.should.have.property('duration')
          res.body.data[0].attributes.should.not.have.property('created_at')
          res.body.data[0].attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('should return 404 if the the recipe doesn\'t exist', () => {
      return chai
        .request(app)
        .get('/api/v1/recipes/999/materials')
        .then(res => {
          res.should.have.status(404)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })

  // get all of the recipes that feature a specific material
  describe('GET /api/v1/materials/:id/recipes', () => {
    it('should return all recipes that contain the specified material', () => {
      return chai
        .request(app)
        .get('/api/v1/materials/1/recipes')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.an('object')
          res.body.data.should.be.an('array')
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('recipes')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('notes')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('hearts')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('value')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('ingredients')
            .that.is.a('array')
          res.body.data[0].attributes.ingredients[0].should.have.property('quantity')
            .that.is.a('number')
          res.body.data[0].attributes.ingredients[0].should.have.property('id')
            .that.is.a('number')
          res.body.data[0].attributes.ingredients[0].should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.ingredients[0].should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.ingredients[0].should.have.property('type')
          res.body.data[0].attributes.ingredients[0].should.have.property('effect')
          res.body.data[0].attributes.ingredients[0].should.have.property('potency')
          res.body.data[0].attributes.ingredients[0].should.have.property('hearts')
          res.body.data[0].attributes.ingredients[0].should.have.property('value')
          res.body.data[0].attributes.ingredients[0].should.have.property('duration')
          res.body.data[0].attributes.ingredients[0].should.not.have.property('created_at')
          res.body.data[0].attributes.ingredients[0].should.not.have.property('updated_at')
          res.body.data[0].attributes.should.not.have.property('created_at')
          res.body.data[0].attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('should return 404 if the the material doesn\'t exist', () => {
      return chai
        .request(app)
        .get('/api/v1/materials/999/recipes')
        .then(res => {
          res.should.have.status(404)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })

  // add a new material
  describe('POST /api/v1/materials', () => {
    it('it should add a material', () => {
      return chai
        .request(app)
        .post('/api/v1/materials')
        .send({
          id: 100000,
          name: 'ZZZZZZZZZ',
          category: 'food',
          type: 'Seasoning',
          effect: '-',
          potency: '-',
          hearts: 2,
          value: 2,
          duration: 50,
        })
        .then(res => {
          res.should.have.status(201)
          res.should.be.json
          res.should.have.header('location')
          res.body.should.be.an('object')
          res.body.data.should.be.an('array')
          res.body.data.length.should.equal(1)
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('materials')
          res.body.data[0].attributes.should.not.have.property('quantity')
            .that.is.a('number')
          res.body.data[0].attributes.should.not.have.property('id')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('type')
          res.body.data[0].attributes.should.have.property('effect')
          res.body.data[0].attributes.should.have.property('potency')
          res.body.data[0].attributes.should.have.property('hearts')
          res.body.data[0].attributes.should.have.property('value')
          res.body.data[0].attributes.should.have.property('duration')
          res.body.data[0].attributes.should.not.have.property('created_at')
          res.body.data[0].attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('it should respond with an error if body contains duplicate id', () => {
      return chai
        .request(app)
        .post('/api/v1/materials')
        .send({
          id: 1,
          name: 'ZZZZZZZZZ',
          category: 'food',
          type: 'Seasoning',
          effect: '-',
          potency: '-',
          hearts: 2,
          value: 2,
          duration: 50,
        })
        .then(res => {
          res.should.have.status(500)
        })
        .catch(({ response }) => {
          response.should.be.json
          response.should.have.status(500)
        })
    })
  })

  // add a new recipe
  describe('POST /api/v1/recipes', () => {
    it('should add a new recipe', () => {
      return chai
        .request(app)
        .post('/api/v1/recipes')
        .send({
          id: 100002,
          name: 'Apple Pie 3',
          category: 'hearts',
          notes: '',
          hearts: 3,
          value: 0,
          ingredients: [
            {
              quantity: 1,
              id: 1,
            },
            {
              quantity: 1,
              id: 11,
            },
            {
              quantity: 1,
              id: 24,
            },
            {
              quantity: 1,
              id: 68,
            },
          ],
        })
        .then(res => {
          res.should.have.status(201)
          res.should.be.json
          res.should.have.header('location')
          res.body.should.be.an('object')
          res.body.data.should.be.an('object')
          res.body.data.should.have.property('id')
            .that.is.a('string')
          res.body.data.should.have.property('type')
            .that.is.a('string')
            .that.equals('recipes')
          res.body.data.attributes.should.have.property('name')
            .that.is.a('string')
          res.body.data.attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data.attributes.should.have.property('notes')
            .that.is.a('string')
          res.body.data.attributes.should.have.property('hearts')
            .that.is.a('number')
          res.body.data.attributes.should.have.property('value')
            .that.is.a('number')
          res.body.data.attributes.should.have.property('ingredients')
            .that.is.a('array')
          res.body.data.attributes.ingredients[0].should.have.property('quantity')
            .that.is.a('number')
          res.body.data.attributes.ingredients[0].should.have.property('id')
            .that.is.a('number')
          res.body.data.attributes.ingredients[0].should.have.property('name')
            .that.is.a('string')
          res.body.data.attributes.ingredients[0].should.have.property('category')
            .that.is.a('string')
          res.body.data.attributes.ingredients[0].should.have.property('type')
          res.body.data.attributes.ingredients[0].should.have.property('effect')
          res.body.data.attributes.ingredients[0].should.have.property('potency')
          res.body.data.attributes.ingredients[0].should.have.property('hearts')
          res.body.data.attributes.ingredients[0].should.have.property('value')
          res.body.data.attributes.ingredients[0].should.have.property('duration')
          res.body.data.attributes.ingredients[0].should.not.have.property('created_at')
          res.body.data.attributes.ingredients[0].should.not.have.property('updated_at')
          res.body.data.attributes.should.not.have.property('created_at')
          res.body.data.attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('it should respond with an error if body contains duplicate id', () => {
      return chai
        .request(app)
        .post('/api/v1/recipes')
        .send({
          id: 1,
          name: 'Apple Pie 2',
          category: 'hearts',
          notes: '',
          hearts: 3,
          value: 0,
          ingredients: [
            {
              quantity: 1,
              id: 1,
            },
            {
              quantity: 1,
              id: 11,
            },
            {
              quantity: 1,
              id: 24,
            },
            {
              quantity: 1,
              id: 68,
            },
          ],
        })
        .then(res => {
          res.should.have.status(500)
        })
        .catch(({ response }) => {
          response.should.be.json
          response.should.have.status(500)
        })
    })
  })

  // update a specific material
  describe('PATCH /api/v1/materials/:id', () => {
    it('should update a specifc material', () => {
      return chai
        .request(app)
        .patch('/api/v1/materials/1')
        .send({
          name: 'ZZZZZZZZZ',
          hearts: 2,
        })
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.should.not.have.header('location')
          res.body.should.be.an('object')
          res.body.data.should.be.an('array')
          res.body.data.length.should.equal(1)
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('materials')
          res.body.data[0].attributes.should.not.have.property('quantity')
            .that.is.a('number')
          res.body.data[0].attributes.should.not.have.property('id')
            .that.is.a('number')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
            .that.equals('ZZZZZZZZZ')
          res.body.data[0].attributes.should.have.property('category')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('type')
          res.body.data[0].attributes.should.have.property('effect')
          res.body.data[0].attributes.should.have.property('potency')
          res.body.data[0].attributes.should.have.property('hearts')
            .that.is.a('number')
            .that.equals(2)
          res.body.data[0].attributes.should.have.property('value')
          res.body.data[0].attributes.should.have.property('duration')
          res.body.data[0].attributes.should.not.have.property('created_at')
          res.body.data[0].attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('should return 404 if the material doesn\'t exist', () => {
      return chai
        .request(app)
        .patch('/api/v1/materials/999')
        .send({
          name: 'ZZZZZZZZZ',
          hearts: 2,
        })
        .then(res => {
          res.should.have.status(404)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })

  // update a specific recipe
  describe('PATCH /api/v1/recipe/:id', () => {
    it('should update a specifc recipe', () => {
      return chai
        .request(app)
        .patch('/api/v1/recipes/1')
        .send({
          ingredients: [
            {
              id: 68,
              quantity: 2,
            },
          ],
        })
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.should.not.have.header('location')
          res.body.should.be.an('object')
          res.body.data.should.be.an('object')
          res.body.data.should.have.property('id').that.is.a('string')
          res.body.data.should.have
            .property('type')
            .that.is.a('string')
            .that.equals('recipes')
          res.body.data.attributes.should.have
            .property('name')
            .that.is.a('string')
          res.body.data.attributes.should.have
            .property('category')
            .that.is.a('string')
          res.body.data.attributes.should.have
            .property('notes')
            .that.is.a('string')
          res.body.data.attributes.should.have
            .property('hearts')
            .that.is.a('number')
          res.body.data.attributes.should.have
            .property('value')
            .that.is.a('number')
          res.body.data.attributes.should.have
            .property('ingredients')
            .that.is.a('array')
          res.body.data.attributes.ingredients[0].should.have
            .property('quantity')
            .that.is.a('number')
          res.body.data.attributes.ingredients[0].should.have
            .property('id')
            .that.is.a('number')
          res.body.data.attributes.ingredients[0].should.have
            .property('name')
            .that.is.a('string')
          res.body.data.attributes.ingredients[0].should.have
            .property('category')
            .that.is.a('string')
          res.body.data.attributes.ingredients[0].should.have.property('type')
          res.body.data.attributes.ingredients[0].should.have.property('effect')
          res.body.data.attributes.ingredients[0].should.have.property('potency')
          res.body.data.attributes.ingredients[0].should.have.property('hearts')
          res.body.data.attributes.ingredients[0].should.have.property('value')
          res.body.data.attributes.ingredients[0].should.have.property('duration')
          res.body.data.attributes.ingredients[0].should.not.have.property(
            'created_at'
          )
          res.body.data.attributes.ingredients[0].should.not.have.property(
            'updated_at'
          )
          res.body.data.attributes.should.not.have.property('created_at')
          res.body.data.attributes.should.not.have.property('updated_at')
        })
        .catch(err => {
          throw err
        })
    })

    it('should return 404 if the recipe doesn\'t exist', () => {
      return chai
        .request(app)
        .patch('/api/v1/recipes/999')
        .send({
          name: 'ZZZZZZZZZ',
          hearts: 2,
        })
        .then(res => {
          res.should.have.status(200)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })

  // delete a material
  describe('DELETE /api/v1/materials/:id', () => {
    it('should send status 204 on successful delete', () => {
      return chai
        .request(app)
        .del('/api/v1/materials/1')
        .then(res => {
          res.should.have.status(204)
        })
        .catch(err => {
          throw err
        })
    })

    it('should send status 404 if material doesn\'t exist', () => {
      return chai
        .request(app)
        .del('/api/v1/materials/999')
        .then(res => {
          res.should.have.status(404)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })

  // delete a recipe
  describe('DELETE /api/v1/recipes/:id', () => {
    it('should send status 204 on successful delete', () => {
      return chai
        .request(app)
        .del('/api/v1/recipes/2')
        .then(res => {
          res.should.have.status(204)
        })
        .catch(err => {
          throw err
        })
    })

    it('should send status 404 if material doesn\'t exist', () => {
      return chai
        .request(app)
        .del('/api/v1/recipes/999')
        .then(res => {
          res.should.have.status(404)
        })
        .catch(({ response }) => {
          response.should.have.status(404)
        })
    })
  })
})
