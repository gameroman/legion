import { h } from 'preact';
import { Route, Router } from 'preact-router';

import AuthProvider from './providers/AuthProvider';
import HomePage from './routes/HomePage';
import GamePage from './routes/GamePage';
import withAuth from './components/withAuth';
import TeamPage from './components/TeamPage';

const App = () => (
	<AuthProvider>
		<div id="app">
			<Router>
				<Route default path="/" component={HomePage} />
				<Route path="/game" component={GamePage} />
				{/* <Route path="/team/:id?" component={withAuth(TeamPage)} /> */}
			</Router>
		</div>
	</AuthProvider>
);

export default App;
