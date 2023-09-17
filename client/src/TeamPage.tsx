// PlayPage.tsx
import { h, Component } from 'preact';
import Roster from './Roster';


class TeamPage extends Component {
  render() {
    return (
        <div>
          <div className="page-header">
            <img src="assets/team.png" className="page-icon" />
            <h1 className="page-title">Team</h1>
          </div>
          <div className="team-content">
            <Roster />
          </div>
        </div>
      );
  }
}

export default TeamPage;