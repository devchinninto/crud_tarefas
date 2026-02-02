import http from 'node:http'

const PORT = 3333

const server = http.createServer((req, res) => { })

server.listen(PORT, () => console.log('Server running!'))