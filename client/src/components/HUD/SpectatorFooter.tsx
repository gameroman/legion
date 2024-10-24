// SpectatorFooter.tsx
import { h, Fragment, Component } from 'preact';
import { PlayMode } from '@legion/shared/enums';

import chestIcon from '@assets/shop/bronze_chest.png';

interface SpectatorFooterProps {
  isTutorial: boolean;
  score: number;
  mode: PlayMode;
  closeGame: () => void;
}

class SpectatorFooter extends Component<SpectatorFooterProps> {
  render() {
    const { isTutorial, score, mode, closeGame } = this.props;
    const showChests = mode != PlayMode.PRACTICE && mode != PlayMode.TUTORIAL;

    return (
      <div className="spectator_footer_wrapper">
        <div className="spectator_footer_container">
          {!isTutorial && (
            <div className="spectator_progress">
              <div className="spectator_progress_bar_bg">
                <div className="spectator_progress_fill">
                  <div className="spectator_progress_fill_mask" style={{ width: `${100 - score / 1500 * 100}%` }}></div>
                </div>
              </div>
              {showChests && (
                <>
                  <div className="progress_ches_mark">
                    <img src={chestIcon} alt="" />
                  </div>
                  <div className="progress_chest_bronze">
                    <img src={chestIcon} alt="" />
                  </div>
                  <div className="progress_chest_silver">
                    <img src={chestIcon} alt="" />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {isTutorial && (
          <div className="skip_tutorial" onClick={closeGame}>
            <span>Skip Tutorial</span>
          </div>
        )}
      </div>
    );
  }
}

export default SpectatorFooter;
