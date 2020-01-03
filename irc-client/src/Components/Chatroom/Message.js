import React from 'react'
import { formatDate } from '../../utils/functions'

function Message(props) {
    const { 
        nickname,
        message,
        createdAt
    } = props.data
    const { className } = props

    if (createdAt) {

    }

    if (Array.isArray(message)){
        return (        
            <li className={className}>
                <ul>
                {message.map((el, index) => {
                    return(
                        <li key={index}>
                            {el.name ? el.name : el}
                        </li>
                    )
                })}
                </ul>
            </li>
        )
    } else if (typeof message === 'string' ) {
        return (
            <li className={`container-fluid ${className} ${nickname === 'server' ? 'bg-light' : ''}`}>
                <div className="row">
                    <div className="col-sm col-md-1">
                        <span className="text-capitalize font-weight-bold">{nickname}</span>
                    </div>
                    <p className="col">
                        {message}
                    </p>
                    <div className="col-sm  col-md-1">
                        <small>{formatDate(createdAt)}</small>
                    </div>
                </div>
            </li>
        )
    } else {
        return null
    }
}

export default Message