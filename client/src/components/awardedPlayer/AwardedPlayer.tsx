// AwardedPlayer.tsx
import './AwardedPlayer.style.css';
import { h, Component } from 'preact';

// Import image assets
import playerProfileBg from '@assets/rank/player_profile_bg.png';

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
        {this.props.players.map((player, index) => (
          <div key={index} className="award-player-container">
            <img src={playerProfileBg} alt="profile background" />
            <span className="award-player-name">{player.name}</span>
            <span className="award-player-title">{player.title}</span>
            <span className="award-player-desc">{player.description}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default AwardedPlayer;