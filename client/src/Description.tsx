// Effect.tsx
import { h, Component } from 'preact';

interface DescProps {
  action: any;
}

class Description extends Component<DescProps> {
  render() {
    const { action } = this.props;
    return (
      <div className="description-area">  
        {
          action.effects && action.effects.map((effect) => {
            const value = effect.value == -1 ? 'FULL' : `+${effect.value}`;
            return (
            <div className={`badge ${effect.stat}`}>  
              <div className="badge-label">{effect.stat.toUpperCase()}</div>
              <div>{value}</div>
            </div>
            );
          })
        }
        <div className='badge cooldown' title='Cooldown'>
          <span className="badge-label">⏳ </span> 
          <span>{action.cooldown}s</span>
        </div>
        <div className='badge target' title='Target type'>
          <span className="badge-label">🎯 </span> 
          <span>{action.target.charAt(0).toUpperCase() + action.target.slice(1)}</span>
        </div>
      </div>
    );
  }
}

export default Description;