exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('recipes', function (table) {
      table.boolean('deleted').defaultTo(false)
    }),
    knex.schema.table('materials', function (table) {
      table.boolean('deleted').defaultTo(false)
    }),
    knex.schema.table('ingredients', function (table) {
      table.boolean('deleted').defaultTo(false)
    }),
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('ingredients').dropColumn('deleted'),
    knex.schema.table('materials').dropColumn('deleted'),
    knex.schema.table('recipes').dropColumn('deleted'),
  ])
}
