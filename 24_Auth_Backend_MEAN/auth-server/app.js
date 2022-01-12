const Server = require('./models/server.config');

const server = new Server()

console.clear()
server.listen()