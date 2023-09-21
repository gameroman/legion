// Roster.tsx
import { h, Component } from 'preact';
import CharacterCard from './CharacterCard';

class Roster extends Component {
  render() {
    const characters = [
      { id: 0, portrait: '/assets/sprites/1_1.png', name: 'Character 1', class: 'Warrior', level: 10, xp: 100, xpToLevel: 200, hp: 100, mp: 50, atk: 10, def: 10, spAtk: 10, spDef: 10 },
      { id: 1, portrait: '/assets/sprites/1_2.png', name: 'Character 2', class: 'Black Mage', level: 15, xp: 100, xpToLevel: 200, hp: 100, mp: 50, atk: 10, def: 10, spAtk: 10, spDef: 10 },
      { id: 2, portrait: '/assets/sprites/1_3.png', name: 'Character 3', class: 'White Mage', level: 1, xp: 100, xpToLevel: 200, hp: 100, mp: 50, atk: 10, def: 10, spAtk: 10, spDef: 10 },
      { id: 3, portrait: '/assets/sprites/1_4.png', name: 'Character 4', class: 'Thief', level: 100, xp: 100, xpToLevel: 200, hp: 100, mp: 50, atk: 10, def: 10, spAtk: 10, spDef: 10 },
    ];

    return (
      <div>
        <div className="section-title">Your Team</div>
        <div className="roster">
            {characters.map(character => <CharacterCard {...character} />)}
        </div>
      </div>
    );
  }
}

export default Roster;