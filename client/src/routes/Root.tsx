import { h } from 'preact';
import { isElectron } from '../utils/electronUtils';
import LandingPage from './LandingPage';
import TitleScreen from './TitleScreen';

const Root = () => {
    if (isElectron()) {
        return <TitleScreen />;
    } else {
        return <LandingPage />;
    }
};

export default Root;
