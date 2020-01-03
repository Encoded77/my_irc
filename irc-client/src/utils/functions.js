/**
 * Add a message to a room
 * @param {array} roomList rooms state from App
 * @param {string} room name of the room to add the message
 * @param {object} message {nickname, message, date}
 * @returns {array} newRoomList
 */
const addMessage = (roomList, roomName, newMsg) => {
    return roomList.map(room => {
        if (room.name === roomName) {
            room.messages.push(newMsg)
        }
        return room
    })
}

/**
 * Utility to add a room to the roomlist
 * @param {array} roomList rooms state from App
 * @param {string} roomName name of the room to add
 */
const addRoom = (roomList, roomName) => {
    roomList.push({
        name: roomName,
        messages: []
    })
    return roomList
}

/**
 * Utility to delete a room from the roomlist
 * @param {array} roomList rooms state from App
 * @param {string} roomName name of the room to delete
 */
const deleteRoom = (roomList, roomName) => {
    // Get index of room & splice it
    const index = roomList.map(room => room.name).indexOf(roomName)
    roomList.splice(index, 1)
    return roomList
}

const formatDate = (stringDate) => {
    const date = new Date(stringDate)
    const toDisplay = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return toDisplay
}

export { addRoom }
export { deleteRoom }
export { addMessage }
export { formatDate }
export default {
    addMessage,
    addRoom,
    deleteRoom,
    formatDate
}