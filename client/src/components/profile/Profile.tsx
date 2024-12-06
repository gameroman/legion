import { h, Component } from 'preact';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { avatarContext } from '../utils';
import './profile.style.css';

interface ProfileData {
    name: string;
    avatar: string;
    allTimeStats: {
        losses: number;
        lossStreak: number;
        wins: number;
        winStreak: number;
    };
    casualStats: {
        gamesPlayed: number;
        wins: number;
    };
    elo: number;
    joinDate: string;
    league: number;
    leagueStats: {
        gamesPlayed: number;
        wins: number;
        winRate: number;
        avgDamage: number;
        avgGold: number;
        avgKills: number;
    };
}

interface Props {
    id: string;
}

interface State {
    profileData: ProfileData | null;
    isLoading: boolean;
    error: string | null;
    avatarUrl: string | null;
}

class Profile extends Component<Props, State> {
    state: State = {
        profileData: null,
        isLoading: true,
        error: null,
        avatarUrl: null
    };

    async componentDidMount() {
        await this.loadProfileData();
    }

    async componentDidUpdate(prevProps: Props) {
        if (prevProps.id !== this.props.id) {
            await this.loadProfileData();
        }
    }

    loadProfileData = async () => {
        this.setState({ isLoading: true, error: null });
        try {
            const response = await fetch(`${process.env.API_URL}/getProfileData?playerId=${this.props.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const profileData = await response.json();
            
            // Load avatar
            if (profileData.avatar !== '0') {
                try {
                    const avatarUrl = avatarContext(`./${profileData.avatar}.png`);
                    this.setState({ avatarUrl });
                } catch (error) {
                    console.error(`Failed to load avatar: ${profileData.avatar}.png`, error);
                }
            }

            this.setState({ profileData, isLoading: false });
        } catch (error) {
            console.error('Error loading profile:', error);
            this.setState({ 
                error: 'Failed to load profile data', 
                isLoading: false 
            });
        }
    };

    formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 1
        }).format(number);
    };

    render() {
        const { profileData, isLoading, error, avatarUrl } = this.state;

        if (isLoading) {
            return <div className="profile-container loading">Loading profile...</div>;
        }

        if (error) {
            return <div className="profile-container error">{error}</div>;
        }

        if (!profileData) {
            return <div className="profile-container error">No profile data found</div>;
        }

        const winRate = profileData.allTimeStats.wins / 
            (profileData.allTimeStats.wins + profileData.allTimeStats.losses) * 100 || 0;

        return (
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar" style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none' }} />
                    <div className="profile-info">
                        <h1>{profileData.name}</h1>
                        <div className="profile-join-date">
                            Member since {this.formatDate(profileData.joinDate)}
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stats-card main-stats">
                        <h2>Overview</h2>
                        <div className="stat-row">
                            <span>ELO Rating</span>
                            <span className="value">{profileData.elo}</span>
                        </div>
                        <div className="stat-row">
                            <span>Win Rate</span>
                            <span className="value">{this.formatNumber(winRate)}%</span>
                        </div>
                        <div className="stat-row">
                            <span>Total Games</span>
                            <span className="value">{profileData.allTimeStats.wins + profileData.allTimeStats.losses}</span>
                        </div>
                    </div>

                    <div className="stats-card">
                        <h2>Ranked Stats</h2>
                        <div className="stat-row">
                            <span>Games Played</span>
                            <span className="value">{profileData.leagueStats.gamesPlayed}</span>
                        </div>
                        <div className="stat-row">
                            <span>Win Rate</span>
                            <span className="value">{this.formatNumber(profileData.leagueStats.winRate)}%</span>
                        </div>
                        <div className="stat-row">
                            <span>Avg. Damage</span>
                            <span className="value">{this.formatNumber(profileData.leagueStats.avgDamage)}</span>
                        </div>
                        <div className="stat-row">
                            <span>Avg. Gold</span>
                            <span className="value">{this.formatNumber(profileData.leagueStats.avgGold)}</span>
                        </div>
                        <div className="stat-row">
                            <span>Avg. Kills</span>
                            <span className="value">{this.formatNumber(profileData.leagueStats.avgKills)}</span>
                        </div>
                    </div>

                    <div className="stats-card">
                        <h2>Achievements</h2>
                        <div className="stat-row">
                            <span>Highest Win Streak</span>
                            <span className="value">{profileData.allTimeStats.winStreak}</span>
                        </div>
                        <div className="stat-row">
                            <span>Total Wins</span>
                            <span className="value">{profileData.allTimeStats.wins}</span>
                        </div>
                        <div className="stat-row">
                            <span>Casual Wins</span>
                            <span className="value">{profileData.casualStats.wins}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile; 