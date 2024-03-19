// TeamContentCard.tsx
import './TeamContentCard.style.css';
import { h, Component } from 'preact';
// import { route } from 'preact-router';

// interface ButtonProps {
//     to: string;
//     label: string;
//   }

class TeamContentCard extends Component {
//   handleClick = () => {
//     route(this.props.to);
//   }

  render() {
    const EQUIPITEMS = [
        {
            name: 'weapon',
            url: './inventory/weapon_icon.png'
        },
        {
            name: 'helm',
            url: './inventory/helm_icon.png'
        },
        {
            name: 'armor',
            url: './inventory/armor_icon.png'
        },
        {
            name: 'belt',
            url: './inventory/belt_icon.png'
        },
        {
            name: 'gloves',
            url: './inventory/gloves_icon.png'
        },
        {
            name: 'boots',
            url: './inventory/boots_icon.png'
        }
    ];

    const renderEquipItems = () => EQUIPITEMS.map((item, index) => (
        <div className="equip-item" key={index}>
            <img src={item.url} alt={item.name} />
        </div>
    ))

    return (
      <div className="team-content-card-container">
        <div className="team-content-container">
            <div className="team-level">
                <span>Lv</span>
                <span className="level-span">10</span>
            </div>
            <div className="team-info-container">
                <div className="team-info">
                    <p className="team-character-name">Alternative_Gray</p>
                    <p className="team-character-class">WARRIOR</p>
                    <div className="team-exp-slider-container">
                        <div className="team-curr-exp-slider"></div>
                    </div>
                    <div className="team-exp-info">
                        <span>EXP <span className="team-curr-exp">980.200</span> / <span className="team-total-exp">1.600.0000</span></span>
                    </div>
                </div>
                <div className="team-sp-container">
                    <span>SP</span>
                    <span className="sp-span">3</span>
                </div>
            </div>
        </div>
        <div className="team-equip-container">
            {renderEquipItems()}
        </div>
      </div>
    );
  }
}

export default TeamContentCard;