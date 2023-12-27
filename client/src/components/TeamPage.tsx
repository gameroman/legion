// PlayPage.tsx
import { h, Component } from 'preact';
import { Router, Route } from 'preact-router';

import Roster from './Roster';
import Character from './Character';
import Inventory from './Inventory';

interface TeamPageProps {
  matches: {
    id?: string;
  };
}
/* eslint-disable react/prefer-stateless-function */

class TeamPage extends Component<TeamPageProps> { 
  render() {
    const characterId = this.props.matches.id || ''; // Fallback to empty string if ID is not present

    return (
        <div>
          <div className="page-header">
            <img src="/assets/team.png" className="page-icon" />
            <h1 className="page-title">Team</h1>
          </div>
          <div className="team-content">
            <Roster />
            <div className="character-inventory-container">
              <Router>
                <Route path="/team/:id" component={() => <Character id={characterId} />} />
              </Router>
              <Inventory id={characterId} />
            </div>
          </div>
        </div>
      );
  }
}

export default TeamPage;