import React, {Component} from 'react'
import ModalForm from './ModalForm'
import withSocket from '../../context/withSocket'

import { MdCreateNewFolder, MdDelete, MdModeComment } from 'react-icons/md'
import { TiThList, TiUser } from 'react-icons/ti'
import { FiUsers } from 'react-icons/fi'

class ChatToolbar extends Component{
    constructor(props) {
        super(props)
    
        this.state = {
            data: {},
            modal: {
                active: false,
                cmd: null,
                ask: ''
            }
        }
        this.modalInput = this.modalInput.bind(this)
        this.getInputs = this.getInputs.bind(this)
    }
    
    modalInput(cmd, ask){
        this.setState({
            data: {},
            modal: {
                active: true,
                cmd,
                ask,
            }
        })
    }

    getInputs(data = {}){
        data.cmd = this.state.modal.cmd
        this.setState({
            data,
            modal: {
                active: false,
                cmd: null,
                ask: '',
            }
        })
        this.props.context.sendMessage(`/${data.cmd} ${data.input}`, this.props.room)
    }

    render(){
    
        const size = "3em"
        const default_class = "mt-2"
        const {
            sendMessage
        } = this.props.context
        const {
            room
        } = this.props

        return (
            <div className="d-flex flex-column justify-content-end align-items-center flex-end h-100 w-100">
                {this.state.modal.active ? 
                    <ModalForm
                        cmd={this.state.modal.cmd}
                        ask={this.state.modal.ask}
                        callback={this.getInputs}
                    />
                    :
                    null
                }
                
                {/* Nick */}
                <TiUser 
                    className={default_class}
                    size={size}
                    id='nick'
                    onClick={() => {
                        this.modalInput('nick', 'What nickname do you want ?')
                    }}
                />

                {/* Room list */}
                <TiThList 
                    className={default_class}
                    size={size}
                    onClick={() => {
                        sendMessage('/list')
                    }}
                />

                {/* Users list */}
                <FiUsers 
                    className={default_class}
                    size={size}
                    onClick={() => {
                        sendMessage('/users', room)
                    }}
                />

                {/* Create room */}
                <MdCreateNewFolder 
                    className={default_class}
                    size={size}
                    id='create'
                    onClick={() => {
                        this.modalInput('create', 'What room do you want to create ?')
                    }}
                />

                {/* Delete room */}
                <MdDelete 
                    className={default_class}
                    size={size}
                    id='delete'
                    onClick={() => {
                        this.modalInput('delete', 'What room do you want to delete ?')
                    }}
                    
                />

                {/* Join room */}
                <MdModeComment 
                    className={default_class}
                    size={size}
                    id='join'
                    onClick={() => {
                        this.modalInput('join', 'What room do you want to join ?')
                    }}
                />
            </div>
        )
        
    }

}

export default withSocket(ChatToolbar)