import React, { Component } from 'react'
import { animateScroll } from "react-scroll"
import MessageList from './MessageList'
import ChatToolbar from '../ChatToolbar'
import withSocket from '../../context/withSocket'

class Chatroom extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.scrollToBottom = this.scrollToBottom.bind(this)
    }

    handleChange(e){
        const {id, value} = e.target
        this.setState({
            [id]:value
        })
    }

    handleSubmit(e){
        e.preventDefault()
        this.props.context.sendMessage(this.state.message, this.props.roomdata.name)
        this.setState({message: ''})
    }

    componentDidMount(){
        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
          containerId: "messageList"
        })
    }
    
    render() {
        const {
            roomdata
        } = this.props
        return (
            <div className="container-fluid flex-grow-1 no-padding">
                <div className="row no-gutters">
                    <div className="col-sm col-md">
                        <ChatToolbar 
                            room={roomdata.name}
                        />
                    </div>
                    <div className="col-sm col-md-11">
                        <MessageList
                            id='messageList'
                            messages={roomdata.messages}
                        />
                    </div>
                </div>
                <form 
                    className="fixed-bottom no-padding bg-dark"
                    onSubmit={this.handleSubmit}   
                >
                    <div className="form-group row no-gutters no-margin pr-1 pl-1">
                        <div className="col-sm-10 col-md-11 w-100">
                            <input 
                                type="text"
                                className="form-control" 
                                id="message"
                                value={this.state.message}
                                onChange={this.handleChange}
                                autoFocus={true}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-sm col-md-1">
                            <button type='submit' className="btn btn-primary w-100">
                                SEND
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default withSocket(Chatroom)