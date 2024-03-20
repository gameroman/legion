
// Inventory.tsx
import { h, Component } from 'preact';
import './Inventory.style.css';
import { items } from '@legion/shared/Items';
import { spells } from '@legion/shared/Spells';
import { equipments } from '@legion/shared/Equipments';
import ActionItem from '../game/HUD/Action';
import { ActionType } from '../game/HUD/ActionTypes';

import { apiFetch } from '../../services/apiService';
import { successToast, errorToast } from '../utils';
import { Link } from 'preact-router';

interface InventoryProps {
  id: string;
  inventory: {
    consumables: number[];
    equipments: number[];
    spells: number[];
  };
  carrying_capacity: number;
  refreshInventory: () => void;
}

class Inventory extends Component<InventoryProps> {
  state = {
    actionType: ActionType.CONSUMABLES,
    openModal: false
  }

  capacity = 50;

  handleActionType = (actionType: string) => {
    this.setState({ actionType: actionType });
  }

  onActionClick = (type: string, letter: string, index: number) => {
    if (!this.props.id) return;

    const payload = {
      index,
      characterId: this.props.id,
    };

    apiFetch('equipItem', {
      method: 'POST',
      body: payload
    })
      .then((data) => {
        if (data.status == 0) {
          successToast('Item equipped!');
          this.props.refreshInventory();
        } else {
          errorToast('Character inventory is full!');
        }
      })
      .catch(error => errorToast(`Error: ${error}`));
  }

  inventoryLength = () => Object.values(this.props.inventory)
    .filter(Array.isArray)
    .map(arr => arr.length)
    .reduce((acc, curr) => acc + curr, 0);

  // componentDidMount(): void {
  //   if (!this.inventoryLength || !this.props.inventory[this.state.actionType]?.length) {
  //     this.setState({ openModdal: true });
  //   }
  // }

  // componentWillUnmount(): void {
  //   this.setState({openModal: false});
  // }

  render() {
    const getAction = (actionIndex: number) => {
      switch (this.state.actionType) {
        case ActionType.CONSUMABLES:
          return items[this.props.inventory[ActionType.CONSUMABLES][actionIndex]];
        case ActionType.SKILLS:
          return spells[this.props.inventory[ActionType.SKILLS][actionIndex]];
        case ActionType.EQUIPMENTS:
          return equipments[this.props.inventory[ActionType.EQUIPMENTS][actionIndex]];
        default: return null;
      }
    }

    const slots = Array.from({ length: this.props.carrying_capacity }, (_, i) =>
    (<div key={i} className="item">
      {i < this.props.inventory[this.state.actionType]?.length &&
        <ActionItem
          action={getAction(i)}
          index={i}
          clickedIndex={-1}
          canAct={true}
          hideHotKey={true}
          actionType={this.state.actionType}
          onActionClick={this.onActionClick}
        />
      }
    </div>
    ));

    const currCategoryStyle = {
      backgroundColor: 'transparent',
      border: '1px solid #a5670f',
    }

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    return (
      <div className="inventoryFullContainer">
        <div className="inventoryContainer">
          <div className="inventoryCategoryContainer">
            <p className="inventoryLabel">INVENTORY</p>
            <div className="inventoryCategories">
              <Link onClick={() => this.setState({ openModal: true })} className="categoryBtn" style={{ backgroundImage: 'url(./inventory/shop_btn.png)' }}></Link>
              <div className="inventoryCategory" style={this.state.actionType === ActionType.CONSUMABLES && currCategoryStyle} onClick={() => this.handleActionType(ActionType.CONSUMABLES)}>CONSUMABLES</div>
              <div className="inventoryCategory" style={this.state.actionType === ActionType.EQUIPMENTS && currCategoryStyle} onClick={() => this.handleActionType(ActionType.EQUIPMENTS)}>EQUIPMENTS</div>
              <div className="inventoryCategory" style={this.state.actionType === ActionType.SKILLS && currCategoryStyle} onClick={() => this.handleActionType(ActionType.SKILLS)}>SKILLS</div>
              <div className="inventoryCategory" style={this.state.actionType === ActionType.UTILITIES && currCategoryStyle} onClick={() => this.handleActionType(ActionType.UTILITIES)}>UTILITIES</div>
              <div className="categoryCount"><span>{this.inventoryLength()} </span>&nbsp;/&nbsp;50</div>
              <div className="categoryBtn" style={{ backgroundImage: 'url(./inventory/info_btn.png)' }}></div>
            </div>
          </div>
          <div className="inventoryWrapper">{slots}</div>
        </div>
        {/* <Modal
          isOpen={this.state.openModal}
          onAfterOpen={() => { }}
          onRequestClose={() => this.setState({ openModal: false })}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>Hello</h2>
          <button onClick={() => this.setState({ openModal: false })}>close</button>
          <div>I am a modal</div>
        </Modal> */}
      </div>
    );
  }
}

export default Inventory;