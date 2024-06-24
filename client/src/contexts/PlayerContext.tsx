import { createContext } from 'preact';
import { DailyLootAllData } from '@legion/shared/interfaces';
import {League} from "@legion/shared/enums";

export interface PlayerContextData {
  name: string;
  avatar: string;
  lvl: number;
  gold: number;
  elo: number;
  rank: number;
  allTimeRank: number;
  dailyloot: DailyLootAllData;
  league: League;
}

export interface PlayerContextState {
  player: PlayerContextData;
}

export const PlayerContext = createContext<{
  player: PlayerContextData;
  setPlayerInfo: (updates: Partial<PlayerContextData>) => void;
  refreshPlayerData: () => void;
}>({
  player: {
    name: '',
    avatar: '0',
    lvl: 0,
    gold: 0,
    elo: 0,
    rank: 0,
    allTimeRank: 0,
    dailyloot: null,
    league: League.BRONZE,
  },
  setPlayerInfo: () => {},
  refreshPlayerData: () => {}
});