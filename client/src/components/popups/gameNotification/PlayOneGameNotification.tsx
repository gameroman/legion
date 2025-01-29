import { h, Component } from 'preact';
import goldChestImage from '@assets/shop/gold_chest.png';
import goldIcon from '@assets/gold_icon.png';
import './PlayOneGameNotification.style.css';

export class PlayOneGameNotification extends Component {
  render() {
    return (
      <div className="game-notification">
        <div className="game-notification-content">
          <img 
            src={goldChestImage} 
            alt="Gold chest" 
            className="game-notification-icon"
          />
          <div className="game-notification-text-container">
            <h3 className="game-notification-header">Getting Started</h3>
            <p className="game-notification-text">
              Play one <span className="highlight-text">Practice</span> or <span className="highlight-text">Casual</span> game to earn{' '}
              <img src={goldIcon} alt="Gold" className="gold-icon" />
              <span className="highlight-text">100 Gold</span>{' '}
              and unlock the <span className="highlight-text">Shop</span>!
            </p>
            <p className="game-notification-subtext">
              This will let you buy useful items for your characters!
            </p>
          </div>
        </div>
      </div>
    );
  }
} 