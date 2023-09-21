// PlayPage.tsx
import { h, Component } from 'preact';
import { Router, Route } from 'preact-router';

import Roster from './Roster';
import Character from './Character';

interface TeamPageProps {
  matches: {
    id: string;
  };
}

class TeamPage extends Component<TeamPageProps> {
  render() {
    return (
        <div>
          <div className="page-header">
            <img src="/assets/team.png" className="page-icon" />
            <h1 className="page-title">Team</h1>
          </div>
          <div className="team-content">
            <Roster />
            <Router>
              <Route path="/team/:id" component={Character} />
            </Router>
          </div>
        </div>
      );
  }
}

export default TeamPage;