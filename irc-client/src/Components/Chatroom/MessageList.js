import React from 'react'
import Message from './Message'

function MessageList(props) {
    const { messages } = props
    let i = 0
    if (messages.length > 0){
        return (
            <ul className="list-group list-group-flush border-top w-100">
                {messages.map((msg, index) => {
                    i = i === 0 ? 1 : 0
                    return(
                        <Message 
                            className={`list-group-item list-group-item-${i === 0 ? 'primary' : 'secondary'}`}
                            key={index}
                            data={msg}
                        />
                    )
                })}
            </ul>
        )
    } else {
        return null
    }
}

export default MessageList