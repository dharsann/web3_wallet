import React from 'react';
import { Button, Input, Modal } from 'antd';

interface SendTransactionFormProps {
  to: string;
  setTo: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  onSendTransaction: (to: string, amount: string) => void;
  isSending: boolean;
  confirmModalVisible: boolean;
  pendingTransaction: { to: string; amount: string } | null;
  onConfirmSend: () => void;
  onCancelConfirm: () => void;
}

const SendTransactionForm: React.FC<SendTransactionFormProps> = ({
  to,
  setTo,
  amount,
  setAmount,
  onSendTransaction,
  isSending,
  confirmModalVisible,
  pendingTransaction,
  onConfirmSend,
  onCancelConfirm,
}) => {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Send ETH</h3>
      <Input
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Button
        type="primary"
        onClick={() => onSendTransaction(to, amount)}
        loading={isSending}
        block
      >
        Send
      </Button>
      <Modal
        title="Confirm Transaction"
        open={confirmModalVisible}
        onOk={onConfirmSend}
        onCancel={onCancelConfirm}
        okText="Sign and Send"
        cancelText="Cancel"
      >
        <p>Are you sure you want to send {pendingTransaction?.amount} ETH to {pendingTransaction?.to}?</p>
        <p>This will require signing a message to approve the transaction.</p>
      </Modal>
    </div>
  );
};

export default SendTransactionForm;