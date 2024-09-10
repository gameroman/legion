import { h, Component, ComponentType } from 'preact';
import { route, RouteProps } from 'preact-router';
import AuthContext from '../contexts/AuthContext';

// Define the props that will be passed to the wrapped component
interface WithAuthProps {
    path: string;
    matches?: {
        id?: string;
    };
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    return class extends Component<P & WithAuthProps> {
        static contextType = AuthContext;

        componentDidMount() {
            this.checkAuth();
        }

        componentDidUpdate() {
            this.checkAuth();
        }

        checkAuth() {
            const { isAuthenticated, signInAsGuest } = this.context;
            const { path, matches } = this.props;

            if (!isAuthenticated) {
                if (path === '/game/:id' && matches?.id === 'tutorial') {
                    // Allow guest access to tutorial
                    signInAsGuest().catch(
                        () => {
                            console.log('Sign in failed, redirecting to landing page');
                            route('/')
                        });
                } else {
                    // Redirect to landing page for other routes
                    route('/');
                }
            }
        }

        render() {
            const { isAuthenticated } = this.context;
            const { path, matches } = this.props;

            if (!isAuthenticated && (path !== '/game/:id' || matches?.id !== 'tutorial')) {
                return null;
            }

            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withAuth;