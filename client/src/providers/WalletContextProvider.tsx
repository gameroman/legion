import { h, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider: FunctionComponent = ({ children }) => {
  const endpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://solana-devnet.g.alchemy.com/v2/7aGAP4QZtAC0FxXqFvVSTz0X4jPLFSd4';
  
  const wallets = useMemo(
    () => [], []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
