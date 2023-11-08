// CharacterCard.tsx
import { h, Component } from 'preact';
import { route } from 'preact-router';

interface CharacterProps {
  id: number;
  portrait: string;
  name: string;
  class: string;
  level: number;
  xp: number;
  hp: number;
  mp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
}

class CharacterCard extends Component<CharacterProps> {
  handleCardClick = () => {
    const { id } = this.props;
    route(`/team/${id}`);
  }

  render() {
    const { portrait, name, class: characterClass, level, xp, hp, mp, atk, def, spAtk, spDef } = this.props;
    const portraitStyle = {
        backgroundImage: `url(${portrait})`,
    };
    const classToCssClass = {
      'Warrior': 'warrior',
      'Thief': 'thief',
      'White Mage': 'white-mage',
      'Black Mage': 'black-mage',
    };

    const cssClass = classToCssClass[characterClass];

  
    return (
      <div className={`character-card ${cssClass}`} onClick={this.handleCardClick}>
        <div className="character-portrait" style={portraitStyle}></div>
        <div className="character-info">
          <span className="character-name">{name}</span>
          <span className="character-class">{characterClass}</span>
        </div>
        <div className="level-badge">
            <span>lvl</span>
            <span className="level-number">{level}</span>
        </div>
      </div>
    );
  }
}

export default CharacterCard;