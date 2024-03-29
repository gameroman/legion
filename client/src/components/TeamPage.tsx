// PlayPage.tsx
import { h, Component } from 'preact';
import { Router, Route } from 'preact-router';

import Roster from './roster/Roster';
import Character from './Character';
import Inventory from './inventory/Inventory';

import { apiFetch } from '../services/apiService';
import { successToast, errorToast } from './utils';
import TeamContentCard from './teamContentCard/TeamContentCard';

interface TeamPageState {
  inventory: {
    consumables: number[];
    equipments: number[];
    spells: number[];
  };
  carrying_capacity: number;
}
interface TeamPageProps {
  matches: {
    id?: string;
  };
}
/* eslint-disable react/prefer-stateless-function */

class TeamPage extends Component<TeamPageProps, TeamPageState> { 
  state = {
    inventory: {
      consumables: [],
      equipments: [],
      spells: [],
    },
    carrying_capacity: 0,
  }

  componentDidMount() {
    this.fetchInventoryData();
    // this.setState({ 
    //   inventory: {
    //     consumables: [0,0,0, 1, 2, 3,3,3],
    //     equipments: [0,1,2],
    //     spells: [0,2,3],
    //   } //data.inventory.sort()
    // });
  }

  fetchInventoryData = async () => {
    try {
        const data = await apiFetch('inventoryData');
        console.log(data);
        this.setState({ 
          inventory: {
            consumables: data.inventory,
            equipments: [],
            spells: [],
          },
          carrying_capacity: data.carrying_capacity
        });
    } catch (error) {
        errorToast(`Error: ${error}`);
    }
  }

  render() {
    const characterId = this.props.matches.id || ''; // Fallback to empty string if ID is not present

    return (
        <div className="team-content">
          <Roster />
          <div className="character-inventory-container">
            <TeamContentCard />
            <Inventory id={characterId} inventory={this.state.inventory} carrying_capacity={this.state.carrying_capacity} refreshInventory={this.fetchInventoryData} />
          </div>
        </div>
      );
  }
}

export default TeamPage;