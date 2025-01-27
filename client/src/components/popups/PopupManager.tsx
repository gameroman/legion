import { h, Component } from 'preact';
import Welcome from '../welcome/Welcome';

export enum Popup {
  Guest = 'GUEST'
}

interface PopupConfig {
  component: any;
  priority: number;
}

const POPUP_CONFIGS: Record<Popup, PopupConfig> = {
  [Popup.Guest]: {
    component: Welcome,
    priority: 2
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

  render() {
    const { activePopup } = this.state;
    if (!activePopup) return null;

    const PopupComponent = POPUP_CONFIGS[activePopup].component;
    return <PopupComponent onHide={this.handlePopupClosed} />;
  }
}

export default PopupManager; 