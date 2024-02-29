// QuestCard.tsx
import CountUp from 'react-countup';
import './QuestCard.style.css';
import { h, Component } from 'preact';

interface CardProps {
    percent: number;
}

class QuestCard extends Component<CardProps> {
    render() {

        return (
            <div className="questCardContainer">
                <div className="questInfoContainer">
                    <span className="fireSpells">Use 5 Fire spells</span>
                    <span>Rewards</span>
                    <p><span className="questGold">500</span> GOLD | <span className="questExp">2000</span> EXP</p>
                </div>
                {this.props.percent === 100 ? <div className="completion"></div> : <div className="chartContainer">
                    <svg viewBox="0 0 63.6619772368 63.6619772368">
                        <circle class="pie-chart" cx="31.8309886184" cy="31.8309886184" r="15.9154943092" />
                    </svg>
                    <div className="chartVal"><span><CountUp duration={3} end={this.props.percent} />%</span></div>
                </div>}
            </div>
        );
    }
}

export default QuestCard;