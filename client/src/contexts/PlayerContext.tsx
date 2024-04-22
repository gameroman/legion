import { createContext } from 'preact';

export interface PlayerContextData {
  name: string;
  lvl: number;
  gold: number;
  elo: number;
  ranking: number;
}

export interface PlayerContextState {
  player: PlayerContextData;
}

export const PlayerContext = createContext<{
  player: PlayerContextData;
  setPlayerInfo: (updates: Partial<PlayerContextData>) => void;
}>({
  player: {
    name: '',
    lvl: 0,
    gold: 0,
    elo: 0,
    ranking: 0
  },
  setPlayerInfo: () => {}
});