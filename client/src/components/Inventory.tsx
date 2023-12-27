
// Inventory.tsx
import { h, Component } from 'preact';

import { items } from '@legion/shared/Items';
import ActionItem from './game/HUD/Action';
import { ActionType } from './game/HUD/ActionTypes';

import toast from '@brenoroosevelt/toast'
import { apiFetch } from '../services/apiService';

interface InventoryState {
    capacity: number;
    inventory: number[];
  }

class Inventory extends Component<object, InventoryState> {
  capacity = 50;
  constructor(props: object) {
      super(props);
      this.state = {
          capacity: this.capacity,
          inventory: []
      };
  }

  componentDidMount() {
    this.fetchInventoryData();
  }

  async fetchInventoryData() {
    try {
        const data = await apiFetch('inventoryData');
        console.log(data);
        this.setState({ 
          inventory: data.inventory.sort()
        });
    } catch (error) {
        toast.error(`Error: ${error}`, {closeBtn: true, position: 'top'});
    }
  }

  onActionClick = (type: string, letter: string, index: number) => {
    console.log('clicked', index);
  
  }
  
  render() {
    const slots = Array.from({ length: this.state.capacity }, (_, i) => (
        <div key={i} className="item">
          { i < this.state.inventory.length &&
            <ActionItem 
              action={items[this.state.inventory[i]]} 
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
              <span className="inventory-capacity">{this.state.inventory.length}/{this.state.capacity}</span>
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