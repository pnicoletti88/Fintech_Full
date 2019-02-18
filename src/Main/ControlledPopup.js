import React, { Component } from 'react';
import Popup from "reactjs-popup";

class ControlledPopup extends Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }
    openModal (){
        this.setState({ open: true })
    }
    closeModal () {
        this.setState({ open: false })
    }

    render() {
        return (
            <div>
                <button className="button" onClick={this.openModal}>
                    {this.props.name}
                </button>
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    onClose={this.closeModal}
                >
                    <div>
                        <a className="close" onClick={this.closeModal} href="#">
                            &times;
                        </a>
                        {this.props.content}
                    </div>
                </Popup>
            </div>
        )
    }
}

export default ControlledPopup;