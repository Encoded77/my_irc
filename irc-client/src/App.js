import React from 'react'

import SocketProvider from './context/SocketProvider'
import withSocket from './context/withSocket'
import TabNavigator from './Components/TabNavigator'
import Chatroom from './Components/Chatroom'

function App(props) {
    // Get rooms from socket context
    const { rooms } = props.context
    return (
        <div className="container-fluid">
            <div className="row min-vh-80">
                <div className="col no-padding">
                    <div className="vh-separator"></div>
                    <TabNavigator className='d-flex flex-column h-100' >
                        { rooms.map((room, index) => {
                            return(
                                <Chatroom 
                                    key={index}
                                    roomdata={room}
                                    tabname={room.name}
                                    closable={room.name !== 'server' ? 'true' : undefined}
                                />
                            )
                        }) }
                    </TabNavigator>
                    <div className="vh-separator"></div>
                </div>
            </div>
        </div>
    )
}

const WrappedApp = withSocket(App)

function EntryPoint() {
    return (
        <SocketProvider>
            <WrappedApp />
        </SocketProvider>
    )
}

export default EntryPoint