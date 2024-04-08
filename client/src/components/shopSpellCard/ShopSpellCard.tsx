// Button.tsx
import './ShopSpellCard.style.css'
import { h, Component } from 'preact';

interface SpellCardProps {
    key: number;
    index: number;
  }

class ShopSpellCard extends Component<SpellCardProps> {
  render() {
    return (
      <div className="" key={this.props.key}>{this.props.index}
      </div>
    );
  }
}

export default ShopSpellCard;