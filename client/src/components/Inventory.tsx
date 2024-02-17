
// Inventory.tsx
import { h, Component } from 'preact';

import { items } from '@legion/shared/Items';
import ActionItem from './game/HUD/Action';
import { ActionType } from './game/HUD/ActionTypes';

import { apiFetch } from '../services/apiService';
import { successToast, errorToast } from './utils';
interface InventoryProps {
  id: string;
  inventory: number[];
  carrying_capacity: number;
  refreshInventory: () => void;
}

class Inventory extends Component<InventoryProps> {
  capacity = 50;

  onActionClick = (type: string, letter: string, index: number) => {
    const payload = {
        index,
        characterId: this.props.id,
    };
    
    apiFetch('equipItem', {
        method: 'POST',
        body: payload
    })
    .then((data) => {
      if(data.status == 0) {
        successToast('Item equipped!');
        this.props.refreshInventory();
      } else {
        errorToast('Character inventory is full!');
      }
    })
    .catch(error => errorToast(`Error: ${error}`));
  }
  
  render() {
    const slots = Array.from({ length: this.props.carrying_capacity }, (_, i) => (
        <div key={i} className="item">
          { i < this.props.inventory.length &&
            <ActionItem 
              action={items[this.props.inventory[i]]} 
              index={i} 
              clickedIndex={-1}
              canAct={true} 
              hideHotKey={true}
              actionType={ActionType.Item}
              onActionClick={this.onActionClick}
            />
          }
        </div>
      ));
    return (
        <div className="inventory-full">
        <div className="inventory-header">
            <img src="/assets/backpacks.png" className="inventory-header-image" />
            <div className="inventory-header-name">
              Inventory
              <span className="inventory-capacity">{this.props.inventory.length}/{this.props.carrying_capacity}</span>
            </div>
            <div className="inventory-header-name-shadow">Inventory</div>
        </div>
        <div className="inventory-full-content">
            {slots}
        </div>
      </div>
    );
  }
}

export default Inventory;