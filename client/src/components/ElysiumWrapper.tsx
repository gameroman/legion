import { h } from 'preact';
import ElysiumPage from './ElysiumPage';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const endpoint = clusterApiUrl('mainnet-beta'); // Use 'devnet' if testing.

const wallets = [
    new PhantomWalletAdapter(),
];

const ElysiumPageWrapper = () => (
    <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
            <ElysiumPage />
        </WalletProvider>
    </ConnectionProvider>
);

export default ElysiumPageWrapper;
