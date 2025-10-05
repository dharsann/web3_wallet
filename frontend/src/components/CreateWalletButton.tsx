import React from 'react';
import { Button } from 'antd';

interface CreateWalletButtonProps {
  onCreateWallet: () => void;
}

const CreateWalletButton: React.FC<CreateWalletButtonProps> = ({ onCreateWallet }) => {
  return (
    <Button onClick={onCreateWallet}>Create Wallet</Button>
  );
};

export default CreateWalletButton;