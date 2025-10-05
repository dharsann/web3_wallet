import React from 'react';

interface WalletDisplayProps {
  address: string;
  balance: string;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ address, balance }) => {
  return (
    <div>
      <strong><p>Address: {address}</p></strong>
      <strong><p>Balance: {balance}</p></strong>
    </div>
  );
};

export default WalletDisplay;