// PlayPage.tsx
import { h, Component } from 'preact';

class RankPage extends Component {
  state = {
   leaderboardData: [
      { rank: 1, player: 'Player1', elo: 1500, wins: 10, losses: 2,  winsRatio: Math.round((10/(10+2))*100) + '%', crowdScore: 5 },
      { rank: 2, player: 'Player2', elo: 1400, wins: 8, losses: 3, winsRatio: Math.round((8/(8+3))*100) + '%',  crowdScore: 3 },
      { rank: 3, player: 'Me', elo: 1300, wins: 7, losses: 3, winsRatio: Math.round((7/(7+3))*100) + '%',  crowdScore: 3 },
      // Add more dummy data here
    ],
    sortColumn: 'elo',
    sortAscending: false
  };

  handleSort = (column) => {
    const isAscending = this.state.sortColumn === column ? !this.state.sortAscending : false;
    const sortedData = [...this.state.leaderboardData].sort((a, b) => {
      if (a[column] < b[column]) return isAscending ? -1 : 1;
      if (a[column] > b[column]) return isAscending ? 1 : -1;
      return 0;
    });

    this.setState({
      leaderboardData: sortedData,
      sortColumn: column,
      sortAscending: isAscending
    });
  };

  camelCaseToNormal = (text) => {
    let result = text.replace(/([A-Z])/g, ' $1').toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  render() {
    const columns = Object.keys(this.state.leaderboardData[0]);

    return (
      <div>
        <div className="page-header">
          <img src="assets/rank.png" className="page-icon" />
          <h1 className="page-title">Rank</h1>
        </div>
        <div className="rank-content">
        <table className="leaderboard-table">
            <thead>
              <tr>
              {columns.map(column => (
                <th onClick={() => this.handleSort(column)}>
                  <div>
                    <span>{this.camelCaseToNormal(column)}</span>
                    <span>
                      {this.state.sortColumn === column ? (this.state.sortAscending ? <i class="fa-solid fa-sort-up"></i> : <i class="fa-solid fa-sort-down"></i>) : <i class="fa-solid fa-sort" style={{visibility: 'hidden'}}></i>}
                    </span>
                  </div>
                </th>
              ))}
              </tr>
            </thead>
            <tbody>
              {this.state.leaderboardData.map((data, index) => (
                <tr key={index} className={data.player === 'Me' ? 'highlighted-row' : ''}>
                  <td>#{data.rank}</td>
                  <td>{data.player}</td>
                  <td>{data.elo}</td>
                  <td>{data.wins}</td>
                  <td>{data.losses}</td>
                  <td>{data.winsRatio}</td>
                  <td>{Array.from({length: data.crowdScore}, (_, i) => <i class="fa-solid fa-star golden-star"></i>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default RankPage;