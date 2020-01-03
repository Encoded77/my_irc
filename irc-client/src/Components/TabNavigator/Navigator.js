import React, { Component } from 'react'
import NavigatorTabs from './NavigatorTabs'

class Navigator extends Component {
    constructor(props) {
        super(props)

        this.state = {
            renderID: 0
        }

        this.changeRenderID = this.changeRenderID.bind(this)
    }

    changeRenderID(renderID){
        this.setState({renderID})
    }

    render() {
        const {
            children = [],
            className
        } = this.props
        return (
            <div className={className}>
                <NavigatorTabs 
                    callback={this.changeRenderID}
                    children={children}
                    active={this.state.renderID}
                />
                {/* Only render a child if its key is the same as the state's renderID*/}
                {children.map((child) => {
                    if (Number(child.key) === Number(this.state.renderID)) {
                        return child
                    }
                    return null
                })}
            </div>
        )
    }
}

export default Navigator