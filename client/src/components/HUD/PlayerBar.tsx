import { h, Component } from 'preact';
import { ProgressBar } from "react-progressbar-fancy";
import './PlayerBar.style.css';
import hpIcon from '@assets/stats_icons/hp_icon.png';
import mpIcon from '@assets/stats_icons/mp_icon.png';

interface PlayerBarProps {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  hasSpells?: boolean;
}

class PlayerBar extends Component<PlayerBarProps> {
  render({ hp, maxHp, mp, maxMp, hasSpells }: PlayerBarProps) {
    return (
      <div className="player_bar_container">
        <div className="player_bar">
          <div className="player_bar_stats">
            <div className="player_bar_stat">
              <div className="player_bar_stat_icon">
                <img src={hpIcon} alt="HP" />
                <span>HP</span>
              </div>
              <ProgressBar 
                score={(hp / maxHp)*100} 
                hideText={true} 
                primaryColor={'#2E7D32'} 
                secondaryColor={'#4CAF50'} 
              />
              <p className="player_bar_stat_value">
                <span style={{color: '#71deff'}}>{hp}</span> / <span>{maxHp}</span>
              </p>
            </div>
            
            {hasSpells && (
              <div className="player_bar_stat">
                <div className="player_bar_stat_icon">
                  <img src={mpIcon} alt="MP" />
                  <span>MP</span>
                </div>
                <ProgressBar 
                  score={(mp / maxMp)*100} 
                  hideText={true} 
                  primaryColor={'#1565C0'} 
                  secondaryColor={'#2196F3'} 
                />
                <p className="player_bar_stat_value">
                  <span style={{color: '#71deff'}}>{mp}</span> / <span>{maxMp}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PlayerBar; 