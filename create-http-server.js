const PORT = 8080

const http = require('http')
const url = require('url')
const fs = require('fs')
const mine = require('./config').types
const path = require('path')

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname
    const realPath = path.join('asset', pathName)
    let ext = path.extname(realPath) // 返回path扩展名，即最后一个部分中的最后一个.字符到字符结束

    ext = ext ? ext.slice(1) : 'unknown'
    fs.readFile(realPath, 'binary', (err, file) => {
        if(err) {
            if(err.code === 'ENOENT') {
                console.error('myfile does not exist');
                res.writeHead(404, {
                    'Content_Type': 'text-plain'
                })
                res.write(`This request URL ${pathName} was not found on this server.`)
                res.end()
            }else {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                })
                res.end()
            }
        }else {
            let contentType = mine[ext] || 'text/plain'
            res.writeHead(200, {
                'Content-Type': contentType
            })
            res.write(file, 'binary')
            res.end()
        }
    })
})
server.listen(PORT)
console.log(`Server running at port: ${PORT}.`)