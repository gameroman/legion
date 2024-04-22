import { h } from 'preact';
import { Route, Router } from 'preact-router';

import AuthProvider from './providers/AuthProvider';
import PlayerProvider from './providers/PlayerProvider';
import HomePage from './routes/HomePage';
import GamePage from './routes/GamePage';
import withAuth from './components/withAuth';
import TeamPage from './components/TeamPage';

const App = () => (
	<AuthProvider>
		<PlayerProvider>
			<div id="app">
				<Router>
					<Route default path="/" component={HomePage} />
					<Route path="/game/:id" component={GamePage} />
					{/* <Route path="/team/:id?" component={withAuth(TeamPage)} /> */}
				</Router>
			</div>
		</PlayerProvider>
	</AuthProvider>
);

export default App;
