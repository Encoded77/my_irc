import React, { Component } from 'react'
import io from 'socket.io-client'
import config from '../utils/env'
import { 
    addMessage,
    addRoom,
    deleteRoom,
} from '../utils/functions'
import SocketContext from './socketContext'

class SocketProvider extends Component {
    constructor(props) {
        super(props)
        console.log('SocketProvider INIT')
    
        this.state = {
            socket: null,
            rooms: []
        }

        // Bindings
        this.handleReceivedServerMessages = this.handleReceivedServerMessages.bind(this)
        this.handleReceivedMessages = this.handleReceivedMessages.bind(this)
        this.handleRoomJoin = this.handleRoomJoin.bind(this)
        this.handleRoomLeave = this.handleRoomLeave.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.leaveRoom = this.leaveRoom.bind(this)
    }

    componentDidMount(){
        // Connect to the server
        const socket = io(config.socket_api)
        // Add a default room to display server messages
        this.setState({
            socket,
            rooms: addRoom(this.state.rooms, 'server')
        }, () => {
            // Subscribe to those event feeds
            socket.on('serverMessage', this.handleReceivedServerMessages)
            socket.on('message', this.handleReceivedMessages)
            socket.on('roomJoin', this.handleRoomJoin)
            socket.on('roomLeave', this.handleRoomLeave)

            // Test emits
            // socket.emit('cmd', {message: '/join bob0'})
            // socket.emit('cmd', {message: '/join bob1'})
            // socket.emit('cmd', {message: '/join bob2'})
            // socket.emit('cmd', {message: 'Lol i joined bob0', room:'bob0'})
        })
    }

    // Add a room to the room list on successful join
    handleRoomJoin(data){
        const { room } = data
        this.setState({
            rooms: addRoom(this.state.rooms, room)
        })
    }

    // Delete a room from the room list on successful leave
    handleRoomLeave(data){
        const { room } = data
        this.setState({
            rooms: deleteRoom(this.state.rooms, room)
        })
    }

    // Add a message to the correct room, return a new array and update state
    handleReceivedServerMessages(receivedData){
        const { message, room } = receivedData
        const roomList = addMessage(this.state.rooms, room, message)
        this.setState({
            rooms: roomList
        })
        console.log('Server messsage', message)
    }

    // Add received messages to the corresponding chatroom and update state
    handleReceivedMessages(data){
        const { message, room } = data
        const roomList = addMessage(this.state.rooms, room, message)
        this.setState({
            rooms: roomList
        })
        console.log('Message', message)
    }

    // Send a message to the specified room
    sendMessage(message, room){
        const { socket } = this.state
        socket.emit('cmd', {message, room})
    }

    // Send a message to leave a room
    leaveRoom(room){
        const { socket } = this.state
        socket.emit('cmd', {message: `/part ${room}`})
    }

    render() {
        const { sendMessage, leaveRoom } = this
        const { rooms, socket } = this.state
        return (
            <SocketContext.Provider
                value={{
                    sendMessage,
                    leaveRoom,
                    rooms, 
                    socket,
                }}
            >
                {this.props.children}
            </SocketContext.Provider>
        )
    }
}

export default SocketProvider