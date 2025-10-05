# Web3 Wallet Cypher

A simple Web3 wallet application built with Next.js (frontend) and FastAPI (backend) for managing Ethereum wallets, checking balances, and sending transactions on the Sepolia testnet.

## Features

- **Create Wallet**: Generate a new Ethereum wallet with a random private key and mnemonic, and register with email for notifications.
- **View Balance**: Fetch and display the ETH balance from the Sepolia testnet.
- **Send Transactions**: Securely send ETH with transaction approval via message signing.
- **Transaction History**: Store and retrieve transaction history in the database.
- **Approval System**: Confirm transactions by signing an approval message.
- **Notifications**: Receive email alerts for transaction activities.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Ant Design
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Blockchain**: Ethereum (Sepolia testnet), Web3.py, Ethers.js

## Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- PostgreSQL database
- Infura API key for Sepolia testnet

## Setup

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -m requirements.txt
   ```

4. Set up the database:
   - Create a PostgreSQL database named `web3wallet`.
   - Update `DATABASE_URL` in `models.py` with your credentials.

5. Run the backend:
   ```bash
   uvicorn app:app --reload
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Create Wallet**: Click "Create Wallet" to generate a new wallet.
2. **Check Balance**: The balance is automatically fetched and displayed.
3. **Send ETH**:
   - Enter recipient address and amount.
   - Click "Send" to open the confirmation modal.
   - Click "Sign and Send" to approve and send the transaction.
4. **Transaction Approval**: Transactions require signing an approval message for security.

## API Endpoints

- `GET /balance?address=<address>`: Get ETH balance.
- `POST /wallets`: Create a new wallet.
- `GET /wallets/{address}/transactions`: Get transaction history.
- `POST /transactions`: Record a transaction.

## Environment Variables

- Update `DATABASE_URL` in `backend/models.py`.
- Update Infura API key in `backend/models.py` and `frontend/src/utils/walletUtils.ts`.
