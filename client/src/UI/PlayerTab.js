// AliveCount.js
import { h, Component } from 'preact';

class PlayerTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: this.props.player,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  tick() {
    this.setState(prevState => {
      if (prevState.player.cooldown > 0) {
        prevState.player.cooldown--;
      }
      return prevState;
    });
  }

  render({player}) {
    const portraitStyle = {
      backgroundImage: `url(${player.portrait})`,
      backgroundPosition: '-45px -45px', // adjust these values to your needs
      backgroundRepeat: 'no-repeat',
    };
    const isCooldownActive = player.cooldown > 0;
    
    return <div className="player-tab box">
        <div className="player-main">
          <div className="player-info">
              <div style={portraitStyle} className="player-portrait" />
          </div>
          <div className="player-stats">
              <div className="player-name">{player.name}</div>
              <div className="cooldown">
                <span className="cooldown-label">⏱ Cooldown</span>
                <span className="cooldown-amount" >{this.formatTime(player.cooldown)} </span>
                <span className="cooldown-state" >{isCooldownActive ? `⏳` : `✅`}</span>
                </div>
              <div className="hp">  
                <span className="hp-label">❤️ HP</span>
                <span className="hp-amount">{player.hp}/{player.maxHp}</span>
              </div>

              <div className="mp">  
                <span className="mp-label">⚡️ MP</span>
                <span className="mp-amount">{player.mp}/{player.maxMp}</span>
              </div>
          </div>
        </div>
        <div className="player-skills">
            <h4>Skills</h4>
            {player.skills.map(skill => 
                <div className="skill">
                    {skill.name}: {skill.cooldown} seconds cooldown
                </div>
            )}
        </div>
        <div className="player-items">
            <h4>Items</h4>
            {player.items.map(item => 
                <div className="item">
                    {item.name}: {item.quantity}
                </div>
            )}
        </div>
    </div>;
  }
}

export default PlayerTab;
