import { h, Component, ComponentType } from 'preact';
import { route, RouteProps } from 'preact-router';
import AuthContext from '../contexts/AuthContext';

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

        componentDidUpdate(prevProps, prevState) {
            this.checkAuth();
        }

        checkAuth = async () => {
            const { isAuthenticated, isLoading, signInAsGuest } = this.context;
            const { path, matches } = this.props;

            // Wait until the auth state is loaded
            if (isLoading) {
                return;
            }

            if (!isAuthenticated) {
                if (path === '/game/:id' && matches?.id === 'tutorial') {
                    try {
                        await signInAsGuest();
                    } catch {
                        console.log('Sign in failed, redirecting to landing page');
                        route('/');
                    }
                } else {
                    // Redirect to landing page for other routes
                    route('/');
                }
            }
        };

        render() {
            const { isAuthenticated, isLoading } = this.context;
            const { path, matches } = this.props;

            // While loading, render null or a loading indicator
            if (isLoading) {
                return null; // Or return a loading spinner if you prefer
            }

            if (!isAuthenticated && !(path === '/game/:id' && matches?.id === 'tutorial')) {
                return null;
            }

            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withAuth;
