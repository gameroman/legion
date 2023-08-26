// Overview.tsx
import { h, Component } from 'preact';

interface Member {
  texture: string;
  name: string;
  hp: number;
  maxHP: number;
  mp: number;
  maxMP: number;
  isAlive: boolean;
  isPlayer: boolean;
}

interface Team {
  members: Member[];
}

interface Props {
  overview: {
    teams: Team[];
  };
}

class Overview extends Component<Props> {
  render({ overview }: Props) {
    if (!overview) {
      return <div></div>; 
    }
    return (
      <div className="overview box">
        {overview.teams.map((team, teamIndex) => (
          <div key={teamIndex} className="team">
            {team.members.map((member, memberIndex) => {
              const portraitStyle = {
                backgroundImage: `url(assets/sprites/${member.texture})`,
                backgroundPosition: '-45px -45px',
                backgroundRepeat: 'no-repeat',
                filter: member.isAlive ? 'none' : 'grayscale(100%)'
              };
              return (
                <div key={memberIndex} className="member">
                  <div style={portraitStyle} className="member-portrait" >
                   {member.isPlayer && <span className="member-index">{memberIndex + 1}</span>}
                  </div>
                  <div className="member-name">Player #{memberIndex + 1}</div>
                  <div className="hp-bar">
                    <div className="hp-fill" style={{width: `${(member.hp / member.maxHP) * 100}%`}}></div>
                  </div>
                  {member.isPlayer && (
                    <div className="mp-bar">
                      <div className="mp-fill" style={{width: `${(member.mp / member.maxMP) * 100}%`}}></div>
                    </div>
                  )}
                </div>
              );
            })}
            
          </div>
        ))}
      </div>
    );
  }
}

export default Overview;