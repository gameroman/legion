
// Inventory.tsx
import { h, Component } from 'preact';

interface InventoryProps {
  // Define your props here
}

interface InventoryState {
    capacity: number;
  }

class Inventory extends Component<InventoryProps, InventoryState> {
    constructor(props: InventoryProps) {
        super(props);
        this.state = {
            capacity: 50, // Initialize capacity
        };
    }
  render() {
    const items = Array.from({ length: this.state.capacity }, (_, i) => (
        <div key={i} className="item"></div>
      ));
    return (
        <div className="inventory-full">
        <div className="inventory-header">
            <img src="/assets/backpacks.png" className="inventory-header-image" />
            <div className="inventory-header-name">Inventory</div>
            <div className="inventory-header-name-shadow">Inventory</div>
        </div>
        <div className="inventory-full-content">
            {items}
        </div>
      </div>
    );
  }
}

export default Inventory;