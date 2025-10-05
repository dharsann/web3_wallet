from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import Wallet, Transaction, get_db, w3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class WalletCreate(BaseModel):
    address: str
    email: str = None

class TransactionCreate(BaseModel):
    wallet_address: str
    tx_hash: str
    to_address: str
    amount: float

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def send_notification(to_email: str, subject: str, body: str):
    sender_email = "your_email@gmail.com"
    sender_password = "your_password"
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
        print(f"Notification sent to {to_email}")
    except Exception as e:
        print(f"Failed to send notification: {e}")

@app.get("/balance")
async def get_balance(address: str):
    balance_wei = w3.eth.get_balance(address)
    balance_eth = w3.from_wei(balance_wei, "ether")  
    return {"address": address, "balance": f"{balance_eth} ETH"}

@app.post("/wallets")
async def create_wallet(wallet: WalletCreate, db: Session = Depends(get_db)):
    db_wallet = db.query(Wallet).filter(Wallet.address == wallet.address).first()
    if db_wallet:
        raise HTTPException(status_code=400, detail="Wallet already exists")
    new_wallet = Wallet(address=wallet.address, email=wallet.email)
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return new_wallet

@app.get("/wallets/{address}/transactions")
async def get_transactions(address: str, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.wallet_address == address).all()
    return transactions

@app.post("/transactions")
async def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = Transaction(wallet_address=transaction.wallet_address, tx_hash=transaction.tx_hash, to_address=transaction.to_address, amount=transaction.amount)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    wallet = db.query(Wallet).filter(Wallet.address == transaction.wallet_address).first()
    if wallet and wallet.email:
        subject = "Transaction Notification"
        body = f"Your transaction has been recorded.\nHash: {transaction.tx_hash}\nTo: {transaction.to_address}\nAmount: {transaction.amount} ETH"
        send_notification(wallet.email, subject, body)

    return db_transaction
