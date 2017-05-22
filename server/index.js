require('dotenv').config()
const app = require('express')()
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const router = require('./router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

app.set('port', process.env.PORT || 3000)

app.use('/api/v1', router)

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`We running on ${app.get('port')}.`)
  })
}

module.exports = app
