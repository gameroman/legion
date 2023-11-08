import { h } from 'preact';
import { Route, Router } from 'preact-router';

import HomePage from '../routes/HomePage';
import GamePage from '../routes/GamePage';

const App = () => (
	<div id="app">
		<Router>
			<Route default path="/" component={HomePage} />
			<Route path="/game" component={GamePage} />
		</Router>
	</div>
);

export default App;
