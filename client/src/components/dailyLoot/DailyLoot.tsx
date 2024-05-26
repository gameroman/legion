// DailyLootBox.tsx
import './DailyLoot.style.css';
import { h, Component } from 'preact';
import BottomBorderDivider from '../bottomBorderDivider/BottomBorderDivider';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

import { apiFetch } from '../../services/apiService';
import { errorToast } from '../utils';
import { ChestColor } from "@legion/shared/enums";
import { DailyLootAllData } from "@legion/shared/interfaces";
import LootBox from "./LootBox";

interface DailyLootProps {
    data: DailyLootAllData
  }

class DailyLoot extends Component<DailyLootProps> {

  render() {
    const { data } = this.props;

    const handleOpen = async (countdown: number, hasKey: boolean) => {
      // Check if countdown is over and if key is owned
      if (countdown > 0) {
          errorToast(`Chest locked, wait for the countdown to end!`);
          return;
      }
      if (!hasKey) {
          errorToast(`You need a key to open this chest, go play a casual or ranked game!`);
          return;
      }
      // TODO: move
      try {
          const data = await apiFetch(`claimChest?chestType=silver`);
          console.log(data);
          // this.setState({ 
          //   ...data
          // });
      } catch (error) {
          errorToast(`Error: ${error}`);
      }
    }

    return (
      <div className="dailyLootContainer">
        <BottomBorderDivider label='DAILY LOOT' />
        {data ? <div className="dailyLoots">
          {Object.keys(data).map((key, index) => {
            const chest = data[key as keyof ChestColor];
            return <LootBox 
              key={index}
              color={key as ChestColor}
              timeRemaining={chest.countdown}
              ownsKey={chest.hasKey}
              onClick={() => handleOpen(chest.countdown, chest.hasKey)}
            />
          })}
        </div> : <Skeleton
          height={100}
          count={1}
          highlightColor='#0000004d'
          baseColor='#0f1421'
          style={{ margin: '2px 0', width: '100%'}} />}
      </div>
    );
  }
}

export default DailyLoot;