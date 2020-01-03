import React from 'react'
import SocketContext from './socketContext'

export default function (WrappedComponent){
    return function SocketHOC(props) {
        return (
            <SocketContext.Consumer>
                {value => {
                    return(<WrappedComponent {...props} context={value}/>)
                }}
            </SocketContext.Consumer>
        )
    }
}