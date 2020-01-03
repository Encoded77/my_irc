import React from 'react'
import withSocket from '../context/withSocket'

function Test(props) {
    return (
        <div>
            {props.children}
        </div>
    )
}

export default withSocket(Test)