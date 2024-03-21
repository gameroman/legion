// ItemDialog.tsx
import './ItemDialog.style.css';
import { h, Component } from 'preact';
import Modal from 'react-modal';
import { ItemDialogType } from './ItemDialogType';

Modal.setAppElement('#root');
interface DialogProps {
    dialogType: string;
    dialogOpen: boolean;
    position: {
        top: number,
        left: number
    };
    handleClose: () => void;
}

class ItemDialog extends Component<DialogProps> {
    
  render() {
    const {dialogType, position, dialogOpen, handleClose} = this.props;

    const customStyles = {
        content: {
          top: position.top,
          left: position.left,
          right: 'auto',
          bottom: 'auto',
          padding: 0,
          border: 'none',
          background: 'transparent'
        },
        overlay: {
          zIndex: 10,
          backgroundColor: 'transparent',
        }
      };
    
    return (
        <Modal isOpen={dialogOpen} style={customStyles} onRequestClose={handleClose}>
        <div className="dialog-container">
          <p className="dialog-heading">{dialogType}</p>
          <div className="dialog-button-container">
            <button className="dialog-accept" onClick={handleClose}><img src="./inventory/confirm_icon.png" alt="confirm" /></button>
            <button className="dialog-decline" onClick={handleClose}><img src="./inventory/cancel_icon.png" alt="confirm" /></button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ItemDialog;