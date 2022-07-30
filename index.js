/* procfile tells Heroku how to start the application.
   dependencies are done with npm install {dependency here}
*/

const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

// Port uses 3001 as set in .env
server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
    // ...notes.map(..) -> spread operator converts array to num
    // console.log(...notes.map((n) => n.id));
})
