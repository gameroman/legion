import './playModeButton.style.css'
import { h, Component } from 'preact';
import { route } from 'preact-router';
import PracticeIcon from '@assets/practice_icon.png';
import CasualIcon from '@assets/casual_icon.png';
import RankedIcon from '@assets/ranked_icon.png';
import SolanaIcon from '@assets/solana.png';
import specialBtnBgActive from '@assets/special_btn_bg_active.png';
import specialBtnBgIdle from '@assets/special_btn_bg_idle.png';
import middlePlayActive from '@assets/middle_play_active.png';
import middlePlayIdle from '@assets/middle_play_idle.png';
import { PlayMode } from '@legion/shared/enums';
import { apiFetch } from '../../services/apiService';

interface Props {
    label: string;
    players?: number;
    mode: PlayMode;
    isLobbies?: boolean;
    disabled?: boolean;
    lockIcon?: string;
    'data-playmode'?: string;
}

class PlayModeButton extends Component<Props> {
    state = {
        active: false,
        lobbiesCount: null
    }

    componentDidMount() {
        if (this.props.isLobbies) {
            this.fetchLobbiesCount();
        }
    }

    fetchLobbiesCount = async () => {
        try {
            const data = await apiFetch('countLobbies');
            this.setState({ lobbiesCount: data.count });
        } catch (error) {
            console.error('Error fetching lobbies count:', error);
        }
    }

    handleCardClick = () => {
        if (this.props.mode == PlayMode.STAKED) {
            route(`/elysium`);
            return;
        } else {
            route(`/queue/${this.props.mode}`);
        }
    }
    
    render() {
        const { label, players, mode, isLobbies, disabled, lockIcon, ...otherProps } = this.props;
        const { active, lobbiesCount } = this.state;

        const btnBg = {
            backgroundImage: `url(${label === 'ranked'  || label === 'elysium'
                ? (active ? specialBtnBgActive : specialBtnBgIdle)
                : (active ? middlePlayActive : middlePlayIdle)
                })`
        };

        const playerSpanStyle = {
            color: `${active ? '#4ff4f6' : '#ffb653'}`
        }

        const btnIcons = {
            practice: PracticeIcon,
            casual: CasualIcon,
            ranked: RankedIcon,
            elysium: SolanaIcon
        }

        const handleClick = disabled ? undefined : this.handleCardClick;

        return (
            <div 
                className={`buttonContainer ${disabled ? 'disabled' : ''}`} 
                style={btnBg} 
                onMouseEnter={() => !disabled && this.setState({active: true})} 
                onMouseLeave={() => !disabled && this.setState({active: false})} 
                onClick={handleClick}
                {...otherProps}
            >
                <img 
                    src={btnIcons[label]} 
                    alt={label} 
                />
                {lockIcon && (
                    <img 
                        src={lockIcon} 
                        alt="Locked" 
                        className="lock-overlay"
                    />
                )}
                <div className="labelContainer">
                    <span className="label">{label}</span>
                    {!disabled && isLobbies 
                        ? (lobbiesCount > 0 && <span className="player"><span style={playerSpanStyle}>{lobbiesCount}</span> {lobbiesCount === 1 ? 'Opponent' : 'Opponents'} Waiting</span>)
                        : (!disabled && players && <span className="player"><span style={playerSpanStyle}>{players}</span> {players === 1 ? 'Player' : 'Players'} Queuing</span>)
                    }
                </div>
            </div>
        );
    }
}

export default PlayModeButton;