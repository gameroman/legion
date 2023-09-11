// Main.tsx
import { h, Component } from 'preact';
import { Router, Route } from 'preact-router';
import HomePage from './HomePage';
import GamePage from './GamePage';

class Main extends Component {
  render() {
    return (
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/game" component={GamePage} />
        <Route path="/play" component={HomePage} />
        <Route path="/team" component={HomePage} />
        <Route path="/shop" component={HomePage} />
      </Router>
    );
  }
}

export { Main };