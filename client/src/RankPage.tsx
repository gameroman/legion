// PlayPage.tsx
import { h, Component } from 'preact';

class RankPage extends Component {
  render() {
    return (
      <div>
        <div className="page-header">
          <img src="assets/rank.png" className="page-icon" />
          <h1 className="page-title">Rank</h1>
        </div>
        <div className="rank-content">
        </div>
      </div>
    );
  }
}

export default RankPage;