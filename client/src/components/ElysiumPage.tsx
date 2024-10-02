import { h, Component } from 'preact';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { PlayerContext } from '../contexts/PlayerContext';
import SolanaWalletService from '../services/SolanaWalletService';

interface State {
  isWalletDetected: boolean;
  isWalletConnected: boolean;
}

class ElysiumPage extends Component<{}, State> {
  static contextType = PlayerContext;
  private walletService: SolanaWalletService;

  state: State = {
    isWalletDetected: false,
    isWalletConnected: false,
  }

  constructor(props: {}) {
    super(props);
    this.walletService = SolanaWalletService.getInstance();
  }

  async componentDidMount() {
    const isWalletDetected = this.walletService.isWalletDetected();
    const isWalletConnected = await this.walletService.checkWalletConnection();
    this.setState({ isWalletDetected, isWalletConnected });
    this.walletService.addWalletStateListener(this.handleWalletStateChange);
  }

  componentWillUnmount() {
    this.walletService.removeWalletStateListener(this.handleWalletStateChange);
  }

  handleWalletStateChange = () => {
    this.setState({
      isWalletConnected: this.walletService.isWalletConnected(),
    });
  };

  handleConnectWallet = async () => {
    const connected = await this.walletService.connectWallet();
    if (connected) {
      this.setState({ isWalletConnected: true });
    }
  }

  render() {
    const { isWalletDetected, isWalletConnected } = this.state;

    if (!isWalletDetected) {
      return <div>No wallet detected</div>;
    }

    if (!isWalletConnected) {
      return (
        <div>
          <button onClick={this.handleConnectWallet}>Connect Wallet</button>
        </div>
      );
    }

    return (
      <div>
        Hello, your wallet is connected!
        <p>Address: {this.walletService.getWalletAddress()}</p>
        <p>Balance: {this.walletService.getBalance()} SOL</p>
      </div>
    );
  }
}

export default ElysiumPage;