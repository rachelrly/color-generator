import http from 'http'
import fs from 'fs'

const server = http.createServer((_: any, res: any) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
})

const PORT = process.env.PORT || 8880

server.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`)
)
