exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('recipes', function (table) {
      table.increments('id').primary()
      table.string('name')
      table.string('category')
      table.text('notes')
      table.float('hearts')
      table.integer('value').unsigned()
      table.timestamps(true, true)
    }),
    knex.schema.createTable('materials', function (table) {
      table.increments('id').primary()
      table.string('name')
      table.string('category')
      table.string('type')
      table.string('effect')
      table.string('potency')
      table.float('hearts')
      table.integer('value').unsigned()
      table.integer('duration').unsigned()
      table.timestamps(true, true)
    }),
    knex.schema.createTable('ingredients', function (table) {
      table.integer('recipe_id').unsigned()
      table.foreign('recipe_id').references('recipes.id')
      table.integer('material_id').unsigned()
      table.foreign('material_id').references('materials.id')
      table.integer('quantity').unsigned()
      table.timestamps(true, true)
    }),
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('ingredients'),
    knex.schema.dropTable('materials'),
    knex.schema.dropTable('recipes'),
  ])
}
