// App.js
import { h, Component, render } from 'preact';
import PlayerTab from './PlayerTab';
import { EventEmitter } from 'eventemitter3';

const events = new EventEmitter();
class App extends Component {
  state = { aliveCount: 0 }

  componentDidMount() {
    events.on('updateAliveCount', this.setAliveCount);
  }

  componentWillUnmount() {
    events.off('updateAliveCount', this.setAliveCount);
  }

  setAliveCount = (count) => {
    this.setState({ aliveCount: count });
  }

  render() {
    return <PlayerTab player={{
      name: 'Player 1',
      number: 1,
      portrait: '1_1.png',
      hp: 600,
      maxHp: 1000,
      mp: 12,
      maxMp: 100,
      cooldown: 2,
      skills: [
        { name: 'Ice ball', frame: '01.png', description: 'Lorem ipsum dolor sit amet conecuetur dolores sit erat'},
        { name: 'Fire ball', frame: '10.png', description: 'Lorem ipsum dolor sit amet conecuetur dolores sit erat' },
        { name: 'Maelstrom', frame: '21.png', description: 'Lorem ipsum dolor sit amet conecuetur dolores sit erat' },
        { name: 'Zombie', frame: '47.png', description: 'Lorem ipsum dolor sit amet conecuetur dolores sit erat' },
      ],
      items: [
        { name: 'Potion', quantity: 2, frame: 'potion.png', description: 'Lorem ipsum dolor sit amet conecuetur dolores sit erat' },
        { name: 'Ether', quantity: 1, frame: 'ether.png', description: 'Lorem ipsum dolor sit amet conecuetur dolores sit erat' },
      ]
    }} />;
  }
}

const root = document.getElementById('root');
render(<App />, root);

export { App, events }
