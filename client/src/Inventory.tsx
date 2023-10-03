
// Inventory.tsx
import { h, Component } from 'preact';

interface InventoryProps {
  // Define your props here
}

class Inventory extends Component<InventoryProps> {
  render() {
    return (
        <div className="inventory-full">
        <div className="inventory-header">
            <img src="/assets/backpacks.png" className="inventory-header-image" />
            <div className="inventory-header-name">Inventory</div>
            <div className="inventory-header-name-shadow">Inventory</div>
        </div>
        <div className="inventory-full-content">
            
        </div>
      </div>
    );
  }
}

export default Inventory;