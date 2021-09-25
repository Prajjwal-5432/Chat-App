const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', socket => {
    console.log('New Web socket connection')

    socket.emit('message', generateMessage('Welcome'))
    socket.broadcast.emit('message', generateMessage('A new user has joined'))

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('profanity is not allowed')
        }
        io.emit('message', generateMessage(message))
        callback('The message was delivered')
    })

    socket.on('disconnect', () => io.emit('message', generateMessage('A user has left')))

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})

server.listen(port, () => {
    console.log('Server is up and running at port:', port)
})