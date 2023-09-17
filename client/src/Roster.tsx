// Roster.tsx
import { h, Component } from 'preact';
import CharacterCard from './CharacterCard';

class Roster extends Component {
  render() {
    const characters = [
      { portrait: 'assets/sprites/1_1.png', name: 'Character 1', class: 'Warrior', level: 10 },
      { portrait: 'assets/sprites/1_2.png', name: 'Character 2', class: 'Black Mage', level: 15 },
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