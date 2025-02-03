import { h, Component } from 'preact';
import Welcome from './welcome/Welcome';
import { PlayOneGameNotification } from './gameNotification/PlayOneGameNotification';
import { UnlockedFeature } from './unlockedFeature/UnlockedFeature';
import { ChestReward } from "@legion/shared/interfaces";
import { LockedFeatures, ShopTab } from "@legion/shared/enums";
import { SimplePopup } from './simplePopup/SimplePopup';
import { UNLOCK_REWARDS } from '@legion/shared/config';

export enum Popup {
  Guest,
  PlayOneGame,
  UnlockedShop,
  BuySomething,
  GoTeamPage,
  EquipConsumable,
  EquipEquipment,
  EquipSpell,
  SwitchCharacterForEquipment,
  SwitchCharacterForSpell,
  UnlockedSpells,
  UnlockedEquipment,
  UnlockedRanked,
  UnlockedConsumables2,
  UnlockedSpells2,
  UnlockedEquipment2,
  UnlockedDailyLoot,
  UnlockedEquipment3,
  UnlockedConsumables3,
  UnlockedSpells3,
  UnlockedCharacters
}

interface UnlockedFeatureConfig {
  name: string;
  description: string;
  rewards: ChestReward[];
  route?: string;
}

interface SimplePopupConfig {
  header?: string;
  text: string;
}

interface PopupConfig {
  component: any;
  priority: number;
  highlightSelectors?: string[];  // CSS selectors for elements to highlight
  props?: UnlockedFeatureConfig | SimplePopupConfig;  // Add props for UnlockedFeature
}

const POPUP_CONFIGS: Record<Popup, PopupConfig> = {
  [Popup.Guest]: {
    component: Welcome,
    priority: -1
  },
  [Popup.PlayOneGame]: {
    component: PlayOneGameNotification,
    priority: 1,
    highlightSelectors: [
      '[data-playmode="practice"]',
      '[data-playmode="casual"]'
    ]
  },
  [Popup.UnlockedShop]: {
    component: UnlockedFeature,
    priority: 2,
    props: {
      name: 'The Shop',
      description: 'There you can spend gold to buy consumables that your characters can use in combat! Here is some gold and some potions to get you started!',
      rewards: UNLOCK_REWARDS[LockedFeatures.CONSUMABLES_BATCH_1],
      route: '/shop'
    }
  },
  [Popup.BuySomething]: {
    component: SimplePopup,
    priority: 3,
    highlightSelectors: ['[data-shop-item="consumable-0"]'],
    props: {
      header: 'Your first purchase',
      text: 'Click on the <span class="highlight-text">Potion</span> to buy one!',
    }
  },
  [Popup.GoTeamPage]: {
    component: SimplePopup,
    priority: 4,
    highlightSelectors: ['[data-team-page]'],
    props: {
      text: 'Go to the <span class="highlight-text">Team Page</span> to check your inventory and equip something you bought!',
    }
  },
  [Popup.EquipConsumable]: {
    component: SimplePopup,
    priority: 5,
    highlightSelectors: ['[data-item-icon="consumables-0"]'],
    props: {
      text: 'Click on a <span class="highlight-text">Potion</span> to equip it on the current character so they can use it in combat!',
    }
  },
  [Popup.UnlockedSpells]: {
    component: UnlockedFeature,
    priority: 6,
    props: {
      name: 'The Spells Shop',
      description: 'You can now buy spells for your mages from the shop! Here is some gold, and some Ethers to replenish MP after casting spells.',
      rewards: UNLOCK_REWARDS[LockedFeatures.SPELLS_BATCH_1],
      route: `/shop/${ShopTab.SPELLS}`
    }
  },
  [Popup.UnlockedEquipment]: {
    component: UnlockedFeature,
    priority: 7,
    props: {
      name: 'The Equipment Shop',
      description: 'You can now buy equipment for your characters from the shop! Here is some gold, and a Golden Ring to start your collection!',
      rewards: UNLOCK_REWARDS[LockedFeatures.EQUIPMENT_BATCH_1],
      route: `/shop/${ShopTab.EQUIPMENTS}`
    }
  },
  [Popup.UnlockedRanked]: {
    component: UnlockedFeature,
    priority: 8,
    props: {
      name: 'Ranked Mode',
      description: 'You can now compete against other players in ranked mode for the top spot on the leaderboard! Here is some more gold, and two Clovers to help you a bit!',
      rewards: UNLOCK_REWARDS[LockedFeatures.RANKED_MODE],
      route: '/rank'
    }
  },
  [Popup.UnlockedConsumables2]: {
    component: UnlockedFeature,
    priority: 9,
    props: {
      name: 'More Consumables',
      description: 'New consumables are available! Here is a sample for you!',
      rewards: UNLOCK_REWARDS[LockedFeatures.CONSUMABLES_BATCH_2],
      route: `/shop`
    }
  },
  [Popup.UnlockedSpells2]: {
    component: UnlockedFeature,
    priority: 10,
    props: {
      name: 'More Spells',
      description: 'New spells are available in the shop!',
      rewards: UNLOCK_REWARDS[LockedFeatures.SPELLS_BATCH_2],
      route: `/shop/${ShopTab.SPELLS}`
    }
  },
  [Popup.UnlockedEquipment2]: {
    component: UnlockedFeature,
    priority: 11,
    props: {
      name: 'More Equipment',
      description: 'New equipment is available in the shop!',
      rewards: UNLOCK_REWARDS[LockedFeatures.EQUIPMENT_BATCH_2],
      route: `/shop/${ShopTab.EQUIPMENTS}`
    }
  },
  [Popup.UnlockedDailyLoot]: {
    component: UnlockedFeature,
    priority: 12,
    props: {
      name: 'Daily Rewards',
      description: 'From now on, you can get a daily rewards, every 6, 12 and 24 hours! Play Casual or Ranked games to get keys to open the chests!',
      rewards: UNLOCK_REWARDS[LockedFeatures.DAILY_LOOT],
    }
  },
  [Popup.UnlockedEquipment3]: {
    component: UnlockedFeature,
    priority: 13,
    props: {
      name: 'More Equipment',
      description: 'New equipment is available in the shop!',
      rewards: UNLOCK_REWARDS[LockedFeatures.EQUIPMENT_BATCH_3],
      route: `/shop/${ShopTab.EQUIPMENTS}`
    }
  },
  [Popup.UnlockedConsumables3]: {
    component: UnlockedFeature,
    priority: 13,
    props: {
      name: 'More Consumables',
      description: 'New consumables are available in the shop!',
      rewards: UNLOCK_REWARDS[LockedFeatures.CONSUMABLES_BATCH_3],
      route: `/shop`
    }
  },
  [Popup.UnlockedSpells3]: {
    component: UnlockedFeature,
    priority: 14,
    props: {
      name: 'More Spells',
      description: 'New spells are available in the shop!',
      rewards: UNLOCK_REWARDS[LockedFeatures.SPELLS_BATCH_3],
      route: `/shop/${ShopTab.SPELLS}`
    }
  },
  [Popup.UnlockedCharacters]: {
    component: UnlockedFeature,
    priority: 12,
    props: {
      name: 'Characters',
      description: 'You can now increase your team size buy purchasing additional characters in the shop!',
      rewards: UNLOCK_REWARDS[LockedFeatures.CHARACTER_PURCHASES],
      route: `/shop/${ShopTab.CHARACTERS}`
    }
  },
  [Popup.SwitchCharacterForEquipment]: {
    component: SimplePopup,
    priority: 15,
    highlightSelectors: ['[data-character-canequip]'],
    props: {
      text: 'One of your <span class="highlight-text">Characters</span> can equip a new piece of equipment! Click on the character to switch to it!',
    }
  },
  [Popup.SwitchCharacterForSpell]: {
    component: SimplePopup,
    priority: 16,
    highlightSelectors: ['[data-character-canlearnspell]'],
    props: {
      text: 'One of your <span class="highlight-text">Characters</span> can learn a new spell! Click on the character to switch to it!',
    }
  },
  [Popup.EquipSpell]: {
    component: SimplePopup,
    priority: 17,
    highlightSelectors: ['[data-item-learnable]'],
    props: {
      text: 'Click on a <span class="highlight-text">Spell</span> to teach it to the current character; they will then be able to use it in combat! But be careful, teaching a spell will take a spell slot and cannot be undone!',
    }
  },
  [Popup.EquipEquipment]: {
    component: SimplePopup,
    priority: 18,
    highlightSelectors: ['[data-item-equipable]'],
    props: {
      text: 'Click on a <span class="highlight-text">Equipment</span> to equip it on the current character to boost their stats as long as it is equipped!',
    }
  }
};

interface Props {
  onPopupResolved: (popup: Popup) => void;
}

interface State {
  activePopup: Popup | null;
  queuedPopups: Set<Popup>;
}

export class PopupManager extends Component<Props, State> {
  state: State = {
    activePopup: null,
    queuedPopups: new Set()
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.activePopup !== prevState.activePopup) {
      // Remove previous highlights
      if (prevState.activePopup) {
        this.removeHighlights(prevState.activePopup);
      }
      // Add new highlights
      if (this.state.activePopup) {
        this.addHighlights(this.state.activePopup);
      }
    }
  }

  componentWillUnmount() {
    if (this.state.activePopup) {
      this.removeHighlights(this.state.activePopup);
    }
  }

  addHighlights(popup: Popup) {
    const config = POPUP_CONFIGS[popup];
    if (config.highlightSelectors) {
      config.highlightSelectors.forEach(selector => {
        if (selector === '[data-character-canequip]') {
          const character = this.context.getCharacterThatCanEquipEquipment();
          if (character) {
            selector = `[data-character-id="${character.id}"]`;
          }
        }
        if (selector === '[data-character-canlearnspell]') {
          const character = this.context.getCharacterThatCanEquipSpells();
          if (character) {
            selector = `[data-character-id="${character.id}"]`;
          }
        }
        if (selector === '[data-item-learnable]') {
          const spellId = this.context.getSpellsThatCurrentCharacterCanEquip();
          if (spellId) {
            selector = `[data-item-icon="spells-${spellId}"]`;
          }
        }
        if (selector === '[data-item-equipable]') {
          const equipmentId = this.context.getEquipmentThatCurrentCharacterCanEquip();
          if (equipmentId) {
            selector = `[data-item-icon="equipments-${equipmentId}"]`;
          }
        }

        const elements = document.querySelectorAll(selector);
        // console.log(`Found ${elements.length} elements for selector: ${selector}`);
        elements.forEach(element => {
          element.classList.add('popup-highlight');
        });
      });
    }
  }

  removeHighlights(popup: Popup) {
    if (!popup) return;
    const config = POPUP_CONFIGS[popup];
    if (config.highlightSelectors) {
      config.highlightSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          element.classList.remove('popup-highlight');
        });
      });
    }
  }

  enqueuePopup = (popup: Popup) => {
    this.setState(prevState => ({
      queuedPopups: new Set([...prevState.queuedPopups, popup])
    }), this.resolvePopup);
  };

  resolvePopup = () => {
    const { queuedPopups } = this.state;
    if (queuedPopups.size === 0) {
      this.setState({ activePopup: null });
      return;
    }

    // Find popup with highest priority
    const nextPopup = Array.from(queuedPopups)
      .reduce((highest, current) => {
        if (!highest) return current;
        return POPUP_CONFIGS[current].priority > POPUP_CONFIGS[highest].priority ? current : highest;
      }, null as Popup | null);

    this.setState({ activePopup: nextPopup });
  };

  handlePopupClosed = () => {
    const { activePopup, queuedPopups } = this.state;
    if (activePopup) {
      queuedPopups.delete(activePopup);
      this.props.onPopupResolved(activePopup);
      this.setState({ queuedPopups }, this.resolvePopup);
    }
  };

  hidePopup = () => {
    this.removeHighlights(this.state.activePopup);
    this.setState({ activePopup: null });
  };

  render() {
    const { activePopup } = this.state;
    if (!activePopup) return null;

    const config = POPUP_CONFIGS[activePopup];
    const PopupComponent = config.component;
    return <PopupComponent 
      onHide={this.handlePopupClosed}
      {...config.props}  
    />;
  }
}

export default PopupManager; 