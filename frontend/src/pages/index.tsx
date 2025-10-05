import { useState } from "react";
import { ethers } from "ethers";
import { Card, message, Input } from "antd";
import CreateWalletButton from "../components/CreateWalletButton";
import WalletDisplay from "../components/WalletDisplay";
import SendTransactionForm from "../components/SendTransactionForm";
import { WalletType } from "../types/types";
import { createWallet as createWalletUtil, fetchBalance as fetchBalanceUtil, sendTransaction as sendTransactionUtil, signMessage } from "../utils/walletUtils";

export default function Wallet() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [balance, setBalance] = useState("0");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<{ to: string; amount: string } | null>(null);
  const [email, setEmail] = useState("");

  const handleCreateWallet = async () => {
    const newWallet = ethers.Wallet.createRandom();
    const walletData: WalletType = {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      mnemonic: newWallet.mnemonic?.phrase || null,
    };
    setWallet(walletData);
    fetchBalanceUtil(newWallet.address, setBalance);
    try {
      await fetch("http://localhost:8000/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletData.address,
          email: email,
        }),
      });
    } catch (error) {
      console.error("Failed to save wallet:", error);
    }
  };

  const handleFetchBalance = (address: string) => {
    fetchBalanceUtil(address, setBalance);
  };

  const handleInitiateSend = (to: string, amount: string) => {
    setPendingTransaction({ to, amount });
    setConfirmModalVisible(true);
  };

  const handleConfirmSend = async () => {
    if (wallet && pendingTransaction) {
      try {
        const messageToSign = `Approve sending ${pendingTransaction.amount} ETH to ${pendingTransaction.to}`;
        await signMessage(wallet, messageToSign);
        sendTransactionUtil(pendingTransaction.to, pendingTransaction.amount, wallet, setTo, setAmount, setIsSending, (address) => fetchBalanceUtil(address, setBalance));
        setConfirmModalVisible(false);
        setPendingTransaction(null);
      } catch (error) {
        message.error("Failed to sign message");
      }
    }
  };

  const handleCancelConfirm = () => {
    setConfirmModalVisible(false);
    setPendingTransaction(null);
  };

  return (
    <Card>
      {!wallet ? (
        <div>
          <Input
            placeholder="Email for notifications"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <CreateWalletButton onCreateWallet={handleCreateWallet} />
        </div>
      ) : (
        <div>
          <WalletDisplay address={wallet.address} balance={balance} />
          <SendTransactionForm
            to={to}
            setTo={setTo}
            amount={amount}
            setAmount={setAmount}
            onSendTransaction={handleInitiateSend}
            isSending={isSending}
            confirmModalVisible={confirmModalVisible}
            pendingTransaction={pendingTransaction}
            onConfirmSend={handleConfirmSend}
            onCancelConfirm={handleCancelConfirm}
          />
        </div>
      )}
    </Card>
  )
}