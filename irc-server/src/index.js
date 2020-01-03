'use strict'
require('dotenv').config()
const { PORT, HOST } = process.env

// App & io init
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const { 
    globalMessage,
    clientServerMessage,
    doesChannelExist,
    doesNicknameExist,
    clientDataResponse,
    globalMessageToRoom,
    getClientByNickname,
} = require('./utils')

// List of all active channels & connected users
let channels = [
// {
//     name: 'bob0',
//     creatorIp: '127.0.0.1',
//     createdAt: '2019-12-02T15:19:56.542Z',
// },
// {
//     name: 'bob1',
//     creatorIp: '127.0.0.1',
//     createdAt: '2019-12-02T15:19:56.542Z'
// },
// {
//     name: 'bob2',
//     creatorIp: '127.0.0.1',
//     createdAt: '2019-12-02T15:19:56.542Z'
// },
]
let users = []

// Socket entry point
io.on('connection', (client) => {
    // default nickname on connection
    if (!client.nickname) {
        let rng = Math.ceil(Math.random() * 100000)
        client.nickname = `USER_${rng}`
    }

    // Command interpreter
    client.on('cmd', (data) => {
        const { message, room } = data
        if (typeof message === 'undefined') return clientServerMessage(client, `Error: please provide a message`)
        const cmd = message.split(' ')

        switch (cmd[0]) {
            case '/nick':
                if (!cmd[1]) return clientServerMessage(client, `Error: please provide a nickname`)
                if (doesNicknameExist(users, cmd[1])) return clientServerMessage(client, `Error: Nickname already in use`)

                const oldNick = client.nickname
                client.nickname = cmd[1]

                users.splice(users.indexOf(oldNick), 1)
                users.push(cmd[1])
    
                globalMessage(client, `${oldNick} has changed their nickname to ${client.nickname}`)
                break

            case '/list':
                if (cmd[1]) {
                    let found = channels.filter(channel => {
                        if (channel.name.includes(cmd[1])) {
                            return channel.name
                        }
                    })
                    clientDataResponse(client, found)

                } else {
                    clientDataResponse(client, channels.filter(channel => channel.name), room ? room : 'server')
                }
                break
            
            // Create a channel
            case '/create':
                if (!cmd[1]) return clientServerMessage(client, `Error: please provide a name`)
                const toCreate = cmd[1]

                if (doesChannelExist(channels, toCreate)) {
                    clientServerMessage(client, `Channel name "${toCreate}" already in use !`)
                } else {
                    channels.push({
                        name: toCreate,
                        creatorIp: client.handshake.address,
                        createdAt: new Date(),
                    })
                    globalMessage(client, `${client.nickname} has created channel ${toCreate}`)
                    client.join(toCreate, (err) => {
                        if (err) return clientServerMessage(client, `Error: ${err}`)
                        client.emit('roomJoin', {room: toCreate})
                        globalMessageToRoom(client, `${client.nickname} has joined "${toCreate}"`, toCreate)
                    })
                }
                break

            // Delete a channel if it exist
            case '/delete':
                if (!cmd[1]) return clientServerMessage(client, `Error: please provide a name`)
                const toDelete = cmd[1]

                if (!doesChannelExist(channels, toDelete)) {
                    clientServerMessage(client, `Channel "${toDelete}" does not exist !`)
                } else {
                    // Disconnect every user of this room
                    io.sockets.in(toDelete).clients(function(err, clients) {
                        if (err) return clientMessageResponse(client, err)
                        const usersInRoom = clients.map(joinedClient => io.sockets.connected[joinedClient])
                        usersInRoom.forEach((user) => {
                            user.leave(toDelete, (err) => {
                                if (err) return clientServerMessage(user, `Error: ${err}`)
                                user.emit('roomLeave', {room: toDelete})
                                clientServerMessage(user, `Successfully left channel "${toDelete}"`)
                                globalMessageToRoom(user, `${user.nickname} has left "${toDelete}"`, toDelete)
                            })
                        })

                        // Get index of channel
                        const index = channels.map(channel => channel.name).indexOf(toDelete)
        
                        if (client.handshake.address !== channels[index].creatorIp){
                            clientServerMessage(client, `You do not own this channel`)
                        } else {
                            channels.splice(index, 1)
                            globalMessage(client, `${client.nickname} has deleted channel ${toDelete}`)
                        }
                    })
                }
                break

            case '/join':
                if (!cmd[1]) return clientServerMessage(client, `Error: please provide a name`)
                const toJoin = cmd[1]

                if (!doesChannelExist(channels, toJoin)) return clientServerMessage(client, `Error: channel does not exist`)
                let alreadyJoined = false
                io.sockets.in(toJoin).clients(function(err, clients) {
                    // check if user is in room
                    if (err) return clientMessageResponse(client, err)
                    clients.map(c => {
                        if(io.sockets.connected[c].nickname == client.nickname) alreadyJoined = true
                    })
                    // If user already joined, send an error
                    if (!alreadyJoined){
                        client.join(toJoin, (err) => {
                            if (err) return clientServerMessage(client, `Error: ${err}`)
                            client.emit('roomJoin', {room: toJoin})
                            clientServerMessage(client, `Successfully joined channel "${toJoin}"`)
                            globalMessageToRoom(client, `${client.nickname} has joined "${toJoin}"`, toJoin)
                        })
                    } else {
                        clientServerMessage(client, `You already joined channel "${toJoin}"`)
                    }
                })

                
                break

            case '/part':
                if (!cmd[1]) return clientServerMessage(client, `Error: please provide a name`)
                const toLeave = cmd[1]

                let alreadyLeft = true
                console.log(toLeave)
                io.sockets.in(toLeave).clients(function(err, clients) {
                    // check if user is in room
                    if (err) return clientMessageResponse(client, err)
                    clients.map(c => {
                        if(io.sockets.connected[c].nickname == client.nickname) alreadyLeft = false
                    })

                    // If user already joined, send an error
                    if (!alreadyLeft){
                        client.leave(toLeave, (err) => {
                            if (err) return clientServerMessage(client, `Error: ${err}`)
                            client.emit('roomLeave', {room: toLeave})
                            clientServerMessage(client, `Successfully left channel "${toLeave}"`)
                            globalMessageToRoom(client, `${client.nickname} has left "${toLeave}"`, toLeave)
                        })
                    } else {
                        clientServerMessage(client, `You are not in this channel "${toLeave}"`)
                    }
                })
                
                break

            case '/users':
                if (!room) return clientServerMessage(client, `Error: room was not provided`)
                io.sockets.in(room).clients(function(err, clients) {
                    if (err) return clientMessageResponse(client, err)
                    const usersInRoom = clients.map(client => io.sockets.connected[client].nickname)
                    clientDataResponse(client, usersInRoom, room)
                })
                break

            case '/msg':
                const toWhisper = cmd[1]
                cmd.splice(0, 2)
                const message = cmd.join(' ')
                if (!message) return clientServerMessage(client, `Error: you can't send an empty whisper`)
                if (!toWhisper) return clientServerMessage(client, `Error: user was not provided`)

                getClientByNickname(io, toWhisper)
                    .then((socket) => {
                        clientServerMessage(socket, `Whisper from ${client.nickname}: ${message}`)
                        clientServerMessage(client, `Whisper sent to ${socket.nickname} (${message})`)
                    })
                    .catch(() => {
                        return clientServerMessage(client, `Error: user ${toWhisper} was not found`)
                    })
                break
        
            default:
                if (!room) return clientServerMessage(client, `Error: room was not provided`)
                if (room === 'server') return clientServerMessage(client, `Error: You cant send messages to this chatroom`)
                if (!doesChannelExist(channels, room)) return clientServerMessage(client, `Error: channel does not exist`)

                const msgData = {
                    message: {
                        message: cmd.join(' '),
                        nickname: client.nickname,
                        createdAt: new Date(),
                    },
                    room,
                }
                client.broadcast.emit('message', msgData)
                client.emit('message', msgData)
                break
        }
    })
})

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`)
})
