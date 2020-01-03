'use strict'

const globalServerMessage = (client, message, room = 'server') => {
    client.broadcast.emit('serverMessage', {
        message: {
            message,
            nickname: 'server',
            createdAt: new Date(),
        },
        room,
    })
    console.log(`Global server message: ${message}`)
}

const clientServerMessage = (client, message, room = 'server') => {
    client.emit('serverMessage', {
        message: {
            message,
            nickname: 'server',
            createdAt: new Date(),
        },
        room,
    })
    console.log(`Client server message (${client.nickname}): ${message}`)
}

const clientDataResponse = (client, message, room = 'server') => {
    client.emit('serverMessage', {
        message: {
            message,
            nickname: 'server',
            createdAt: new Date(),
        },
        room,
    })
}

const globalMessageToRoom = (client, message, room) => {
    const msgData = {
        message: {
            message,
            nickname: 'server',
            createdAt: new Date(),
        },
        room
    }
    client.emit('message', msgData)
    client.broadcast.emit('message', msgData)
}

const globalMessage = (client, message) => {
    globalServerMessage(client, message)
    clientServerMessage(client, message)
}

const doesChannelExist = (channels, toCheck) => {
    let exist = false
    for ( let channel of channels){
        if (channel.name === toCheck) {
            exist = true
            break
        }

    }
    return exist
}

const doesNicknameExist = (users, newNickname) => {
    let exist = false
    for ( let nickname of users){
        if (nickname === newNickname) {
            exist = true
            break
        }
    }
    return exist
}

const getClientByNickname = (io, nickname) => {
    return new Promise((resolve, reject) => {
        io.sockets.clients(function(err, clients) {
            if (err) return clientMessageResponse(client, err)
            clients.map(client => {
                const socket = io.sockets.connected[client]
                if (socket.nickname === nickname){
                    resolve(socket)
                }
            })
            reject()
        })
    })
}

module.exports = {
    globalServerMessage,
    clientServerMessage,
    clientDataResponse,
    globalMessage,
    globalMessageToRoom,
    doesChannelExist,
    doesNicknameExist,
    getClientByNickname,
}