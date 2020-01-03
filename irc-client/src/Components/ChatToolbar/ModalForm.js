import React, { Component } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

class ModalForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalIsOpen: true,
            input: '',
        }

        this.closeModal = this.closeModal.bind(this)
        this.openModal = this.openModal.bind(this)
        this.afterOpenModal = this.afterOpenModal.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        })
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    closeModal(){
        this.setState({
            modalIsOpen: false
        })
        this.props.callback()
    }

    handleChange(e){
        const { id, value } = e.target
        this.setState({
            [id]: value
        })
    }

    onSubmit(e){
        e.preventDefault()
        this.props.callback({
            input: this.state.input
        })
    }
    
    render() {
        console.log(this.props)
        const {
            ask
        } = this.props
        const {
            modalIsOpen
        } = this.state
        const {
            afterOpenModal,
            closeModal,
            onSubmit,
            handleChange,
        } = this
        return (
            <>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <form onSubmit={onSubmit}>
                        <label htmlFor='input'>{ask}</label>
                        <input
                            id='input'
                            onChange={handleChange}
                            autoFocus={true}
                        />
                    </form>
                </Modal>
            </>
        )
    }
}

export default ModalForm