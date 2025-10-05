import { ethers } from "ethers";
import { message } from "antd";
import { WalletType } from "../types/types";

export const signMessage = async (wallet: WalletType, messageToSign: string): Promise<string> => {
  const walletInstance = new ethers.Wallet(wallet.privateKey);
  return await walletInstance.signMessage(messageToSign);
};

export const createWallet = (
  setWallet: (wallet: WalletType) => void,
  fetchBalance: (address: string) => void
) => {
  const newWallet = ethers.Wallet.createRandom();
  const wallet: WalletType = {
    address: newWallet.address,
    privateKey: newWallet.privateKey,
    mnemonic: newWallet.mnemonic?.phrase || null,
  };
  setWallet(wallet);
  fetchBalance(newWallet.address);
};

export const fetchBalance = async (address: string, setBalance: (balance: string) => void) => {
  try {
    const res = await fetch(`http://localhost:8000/balance?address=${address}`);
    const data = await res.json();
    setBalance(data.balance);
  } catch (error) {
    message.error("Failed to fetch balance.");
  }
};

export const sendTransaction = async (
  to: string,
  amount: string,
  wallet: WalletType,
  setTo: (to: string) => void,
  setAmount: (amount: string) => void,
  setIsSending: (sending: boolean) => void,
  fetchBalance: (address: string) => void
) => {
  if (!to || !amount) {
    message.error("Recipient address and amount are required.");
    return;
  }
  if (!ethers.isAddress(to)) {
    message.error("Invalid recipient address.");
    return;
  }
  try {
    setIsSending(true);
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/35febef7b9a24e5f8e839271015ac9a6");
    const walletInstance = new ethers.Wallet(wallet.privateKey, provider);
    const tx = await walletInstance.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });
    message.success(`Transaction sent: ${tx.hash}`);
    setTo("");
    setAmount("");
    fetchBalance(wallet.address);
  } catch (error: any) {
    message.error(`Transaction failed: ${error.message}`);
  } finally {
    setIsSending(false);
  }
};