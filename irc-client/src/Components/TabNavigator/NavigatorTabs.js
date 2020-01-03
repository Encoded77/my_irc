import React from 'react'
import withSocket from '../../context/withSocket'
import { TiTimes } from 'react-icons/ti'

function NavigatorTabs(props) {
    const {
        callback,
        children,
        active,
    } = props
    return (
        <ul className="nav nav-tabs fixed-top bg-primary">
            {children.map((child) => {
                // get usable props
                const {
                    closable,
                    tabname = 'default_tab_name',
                    roomdata,
                } = child.props
                // Check if its the current tab
                const isActive = (Number(active) === Number(child.key))
                return(
                    <li className="nav-item" key={child.key}>
                        <span className={`nav-link ${(isActive) ? 'active' : ''}`} 
                            onClick={()=> {
                                if (!isActive){
                                    callback(child.key)
                                }
                            }} 
                        >
                            <span className="pr-5 pl-5 pt-3 pb-3">
                                {tabname}
                            </span>
                            <span onClick={() => {
                                callback('0')
                                props.context.leaveRoom(roomdata.name)
                            }}>
                                {closable && isActive ? <TiTimes /> : ''}
                            </span>
                        </span>
                    </li>
                )
            })}
        </ul>
    )
}

export default withSocket(NavigatorTabs)