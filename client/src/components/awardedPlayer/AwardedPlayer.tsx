// AwardedPlayer.tsx
import './AwardedPlayer.style.css';
import { h, Component } from 'preact';
import { loadAvatar } from '../utils';

interface Player {
  name: string;
  avatar: string;
  title: string;
  description: string;
}

interface AwardedPlayerProps {
  players: Player[];
}

class AwardedPlayer extends Component<AwardedPlayerProps> {
  render() {
    return (
      <div className="highlights-container">
        {
          this.props.players.map(player => 
            <div className="award-player-container">
              <div className="award-player-avatar-container">
                <img src={loadAvatar(player.avatar)} />
              </div>  
              <span className="award-player-name">{player.name}</span>
              <span className="award-player-title">{player.title}</span>
              <span className="award-player-desc">{player.description}</span>
            </div>
          )
        }
      </div>
    );
  }
}

export default AwardedPlayer;