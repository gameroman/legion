// AliveCount.js
import { h, Component } from 'preact';

class AliveCount extends Component {
  render() {
    console.log('render');
    return <div className="alive-count">Alive: {this.props.count}</div>;
  }
}

export default AliveCount;
