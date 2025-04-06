from datetime import datetime
from service import LNbits
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from service import LNbits
# from models import Account, Wallet, WalletInfo, Invoice
from typing import Optional, Dict, List

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# # Initialize LNbits client
# client = LNbits("d8b998eb-43b2-4b5c-99c8-09be784d7130-00-2vruzzgf8t7wo.picard.replit.dev")

# # Hardcoded admin wallet keys - Replace with your actual wallet keys
# ADMIN_WALLET_INKEY = "YOUR_ADMIN_WALLET_INKEY_HERE"
# ADMIN_WALLET_ADMINKEY = "YOUR_ADMIN_WALLET_ADMINKEY_HERE"


client = LNbits("d8b998eb-43b2-4b5c-99c8-09be784d7130-00-2vruzzgf8t7wo.picard.replit.dev")

# Hardcoded admin wallet keys - Replace these with your actual wallet keys
# These should be from a wallet that already has funds


# ADMIN_WALLET_INKEY = "9fe85e1cacb0438ba8456a8ff9107e2f"
# ADMIN_WALLET_ADMINKEY = "13ce6601e9974aa989c579236616c1c4"



ADMIN_WALLET_INKEY = "13ce6601e9974aa989c579236616c1c4"
ADMIN_WALLET_ADMINKEY = "9fe85e1cacb0438ba8456a8ff9107e2f"





# Request and response models
class CreateWalletResponse(BaseModel):
    success: bool
    message: str
    wallet_id: Optional[str] = None
    adminkey: Optional[str] = None
    inkey: Optional[str] = None

class BalanceResponse(BaseModel):
    success: bool
    balance: Optional[int] = None
    message: Optional[str] = None

class BetRequest(BaseModel):
    bet_id: str
    option: str
    wallet_adminkey: str

class BetResponse(BaseModel):
    success: bool
    message: str

class ResolveBetRequest(BaseModel):
    bet_id: str
    winning_option: str

class ResolveBetResponse(BaseModel):
    success: bool
    message: str


###


ACTIVE_BETS = {}


class PlaceBetRequest(BaseModel):
    match_id: str
    selected_outcome: str
    wallet_adminkey: str
    wallet_inkey: str
    odds: float
    amount: int = 1

class PlaceBetResponse(BaseModel):
    success: bool
    message: str
    transaction_id: Optional[str] = None

class ResolveBetRequest(BaseModel):
    match_id: str
    winning_outcome: str

class ResolveBetResponse(BaseModel):
    success: bool
    message: str
    payouts: int = 0




@app.get("/hello")
def hello():
    return "hello"


@app.get("/test")
def here():
    return {"message" : "here"}


# @app.post("/api/create-wallet", response_model=CreateWalletResponse)
# async def create_wallet(username_data: dict):
#     username = username_data.get("username")
#     if not username:
#         raise HTTPException(status_code=400, detail="Username is required")
    
#     # Rest of implementation..
    
#     try:
#         # Create account
#         account = client.create_account(name=username)
        
#         # Create wallet
#         wallet = client.create_wallet(
#             account_api_key=account.adminkey,
#             name=f"{username}'s wallet"
#         )
        
#         # Fund the wallet with initial sats
#         try:
#             # Create invoice from the new wallet
#             invoice = client.create_invoice(
#                 wallet_key=wallet.inkey,
#                 amount_sats=1,
#                 memo="Initial funding"
#             )
            
#             # Pay the invoice using admin wallet
#             client.pay_invoice(
#                 wallet_adminkey=ADMIN_WALLET_ADMINKEY,
#                 invoice=invoice.bolt11
#             )
#         except Exception as fund_error:
#             # Return wallet even if funding fails
#             print(f"Error funding wallet: {fund_error}")
#             return CreateWalletResponse(
#                 success=True,
#                 message="Wallet created but funding failed. Please try again later.",
#                 wallet_id=wallet.id,
#                 adminkey=wallet.adminkey,
#                 inkey=wallet.inkey
#             )
        
#         return CreateWalletResponse(
#             success=True,
#             message="Wallet created and funded successfully",
#             wallet_id=wallet.id,
#             adminkey=wallet.adminkey,
#             inkey=wallet.inkey
#         )
#     except Exception as e:
#         print(f"Error creating wallet: {e}")
#         return CreateWalletResponse(
#             success=False,
#             message=f"Error creating wallet: {str(e)}"
#         )



def fund_new_wallet(wallet_inkey, amount_sats=1):

    """Helper function to fund a newly created wallet with initial sats"""
    try:
        # Create invoice from the new wallet
        invoice = client.create_invoice(
            wallet_key=wallet_inkey,
            amount_sats=amount_sats,
            memo="Initial funding"
        )
        
        # Pay the invoice using admin wallet
        client.pay_invoice(
            wallet_adminkey=ADMIN_WALLET_ADMINKEY,
            invoice=invoice.bolt11
        )
        
        return True
    except Exception as e:
        print(f"Error funding wallet: {e}")
        return False


@app.post("/api/create-wallet", response_model=CreateWalletResponse)
async def create_wallet(username_data: dict):
    username = username_data.get("username")
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    
    try:
        # Create account
        account = client.create_account(name=username)
        
        # Create wallet
        wallet = client.create_wallet(
            account_api_key=account.adminkey,
            name=f"{username}'s wallet"
        )


        fund_new_wallet(
                wallet_inkey=wallet.inkey,
                amount_sats=1
            )
        
        # Return success without attempting to fund the wallet
        return CreateWalletResponse(
            success=True,
            message="Wallet created successfully",
            wallet_id=wallet.id,
            adminkey=wallet.adminkey,
            inkey=wallet.inkey
        )
    except Exception as e:
        print(f"Error creating wallet: {e}")
        return CreateWalletResponse(
            success=False,
            message=f"Error creating wallet: {str(e)}"
        )

@app.get("/api/balance/{wallet_inkey}", response_model=BalanceResponse)
async def get_balance(wallet_inkey: str):
    """
    Get the balance of a wallet using the inkey from local storage.
    """
    try:
        wallet_info = client.get_wallet(wallet_inkey)

        if wallet_info:
            return BalanceResponse(
                success=True,
                balance=wallet_info.balance
            )
        else:
            return BalanceResponse(
                success=False,
                message="Wallet not found"
            )
    except Exception as e:
        print(f"Error getting balance: {e}")
        return BalanceResponse(
            success=False,
            message=f"Error getting balance: {str(e)}"
        )

# @app.post("/api/place-bet", response_model=BetResponse)
# async def place_bet(bet_request: BetRequest):
#     """
#     Place a bet using the wallet adminkey from local storage.
#     """


#     bet_id = bet_request.bet_id
#     option = bet_request.option
#     user_wallet_adminkey = bet_request.wallet_adminkey
    
#     # Validate bet
#     if bet_id not in ACTIVE_BETS:
#         return BetResponse(success=False, message="Bet not found")
    
#     if ACTIVE_BETS[bet_id]["status"] != "open":
#         return BetResponse(success=False, message="Betting is closed")
    
#     if option not in ACTIVE_BETS[bet_id]["options"]:
#         return BetResponse(success=False, message="Invalid betting option")
    
#     try:
#         # Get wallet info from adminkey
#         wallet_info = None
#         try:
#             wallet_info = client.get_wallet(user_wallet_adminkey)
#         except:
#             pass
        
#         if not wallet_info:
#             return BetResponse(success=False, message="Invalid wallet credentials")
        
#         # Create invoice from admin wallet
#         invoice = client.create_invoice(
#             wallet_key=ADMIN_WALLET_INKEY,
#             amount_sats=1,
#             memo=f"Bet on {bet_id}: {option}"
#         )
        
#         # Pay the invoice from user walletx
#         client.pay_invoice(
#             wallet_adminkey=user_wallet_adminkey,
#             invoice=invoice.bolt11
#         )
        
#         # Add participant to the bet
#         ACTIVE_BETS[bet_id]["participants"][option].append({
#             "wallet_id": user_wallet_adminkey,  # Store the adminkey for identification
#             "amount": 1
#         })
        
#         return BetResponse(success=True, message="Bet placed successfully")
#     except Exception as e:
#         print(f"Error placing bet: {e}")
#         return BetResponse(success=False, message=f"Error placing bet: {str(e)}")



@app.post("/api/place-bet", response_model=PlaceBetResponse)
async def place_bet(bet_request: PlaceBetRequest):
    """
    Place a bet using the wallet adminkey from local storage.
    
    1. User sends wallet admin key and make an invoice to admin 
    2. Store user wallet invoice key against the option to help in the resolve
    """
    match_id = bet_request.match_id
    selected_outcome = bet_request.selected_outcome
    wallet_adminkey = bet_request.wallet_adminkey
    wallet_inkey = bet_request.wallet_inkey
    odds = bet_request.odds
    amount = bet_request.amount
    
    try:
        # Validate wallet credentials
        print("HERE")

        try:
            wallet_info = client.get_wallet(wallet_adminkey)
            if not wallet_info:
                return PlaceBetResponse(success=False, message="Invalid wallet credentials")
        except Exception as wallet_error:
            print(f"Error validating wallet: {wallet_error}")
            return PlaceBetResponse(success=False, message="Failed to validate wallet")
        
        # Create invoice from admin wallet
        try:
            invoice = client.create_invoice(
                wallet_key=ADMIN_WALLET_INKEY,
                amount_sats=amount,
                memo=f"Bet on {match_id}: {selected_outcome}"
            )
        except Exception as invoice_error:
            print(f"Error creating invoice: {invoice_error}")
            return PlaceBetResponse(success=False, message="Failed to create invoice")
        
        # Pay the invoice from user wallet
        try:
            payment = client.pay_invoice(
                wallet_adminkey=wallet_adminkey,
                invoice=invoice.bolt11
            )
            
            # Extract transaction ID
            transaction_id = payment.checking_id if hasattr(payment, 'checking_id') else "unknown"

        except Exception as payment_error:
            print(f"Error processing payment: {payment_error}")
            return PlaceBetResponse(success=False, message="Payment failed - insufficient funds or network error")
        
        # Use setdefault to handle initialization in one step
        bet_record = ACTIVE_BETS.setdefault(match_id, {
            "status": "open",
            "winner": None,
            "participants": {}
        })

        # Use setdefault again for the participants list
        participants = bet_record["participants"].setdefault(selected_outcome, [])

        # Add the new participant to the list
        participants.append({
            "wallet_adminkey": wallet_adminkey,
            "wallet_inkey": wallet_inkey,
            "amount": amount,
            "odds": odds,
            "timestamp": datetime.now().isoformat()
        })

        print(ACTIVE_BETS)
        
        return PlaceBetResponse(
            success=True, 
            message=f"Bet placed on {selected_outcome}",
            transaction_id=transaction_id
        )
    except Exception as e:
        print(f"Error placing bet: {e}")
        return PlaceBetResponse(success=False, message=f"Error placing bet: {str(e)}")
    
    

# @app.post("/api/resolve-bet", response_model=ResolveBetResponse)
# async def resolve_bet(resolve_request: ResolveBetRequest):
#     """
#     Resolve a bet and distribute winnings.
#     This would normally have admin authentication.
#     """
#     bet_id = resolve_request.bet_id
#     winning_option = resolve_request.winning_option
    
#     if bet_id not in ACTIVE_BETS:
#         return ResolveBetResponse(success=False, message="Bet not found")
    
#     if winning_option not in ACTIVE_BETS[bet_id]["options"]:
#         return ResolveBetResponse(success=False, message="Invalid winning option")
    
#     # Mark bet as closed with winner
#     ACTIVE_BETS[bet_id]["status"] = "closed"
#     ACTIVE_BETS[bet_id]["winner"] = winning_option
    
#     # Calculate total bets
#     total_participants = 0
#     for option in ACTIVE_BETS[bet_id]["options"]:
#         total_participants += len(ACTIVE_BETS[bet_id]["participants"][option])
    
#     if total_participants == 0:
#         return ResolveBetResponse(success=True, message="No participants in this bet")
    
#     # Distribute winnings (1:1 odds as specified)
#     winners = ACTIVE_BETS[bet_id]["participants"][winning_option]
#     successful_payouts = 0
#     for winner in winners:
#         try:
#             # Create invoice from winner's wallet
#             invoice = client.create_invoice(
#                 wallet_key=winner["wallet_id"],
#                 amount_sats=winner["amount"] * 2,  # Double the bet amount for 1:1 odds
#                 memo=f"Winnings from bet {bet_id}"
#             )
            
#             # Pay the invoice from admin wallet
#             client.pay_invoice(
#                 wallet_adminkey=ADMIN_WALLET_ADMINKEY,
#                 invoice=invoice.bolt11
#             )
            
#             successful_payouts += 1
#         except Exception as e:
#             print(f"Error paying winner {winner['wallet_id']}: {e}")
    
#     return ResolveBetResponse(
#         success=True, 
#         message=f"Bet resolved with {successful_payouts} winners paid out"
#     )

@app.get("/api/bets")
async def get_bets():
    """
    Get the list of active bets.
    """
    return ACTIVE_BETS

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)




@app.post("/api/resolve-bet", response_model=ResolveBetResponse)
async def resolve_bet(resolve_request: ResolveBetRequest):
    """
    Resolve a bet and distribute winnings.
    
    1. Get the id and option on who has won
    2. Return the amounts to the people who have won
    """
    match_id = resolve_request.match_id
    winning_outcome = resolve_request.winning_outcome
    
    # Validate match exists in active bets
    if match_id not in ACTIVE_BETS:
        return ResolveBetResponse(success=False, message="Match not found in active bets")
    
    match_bets = ACTIVE_BETS[match_id]
    
    # Check if match is already resolved
    if match_bets["status"] == "closed":
        return ResolveBetResponse(success=False, message="Match is already resolved")
    
    # Mark match as closed with winner
    match_bets["status"] = "closed"
    match_bets["winner"] = winning_outcome
    
    # Get winning participants
    winners = match_bets["participants"].get(winning_outcome, [])
    
    if not winners:
        return ResolveBetResponse(success=True, message="No winners to pay out", payouts=0)
    
    # Pay out winnings
    successful_payouts = 0
    try:
        for winner in winners:
            try:
                # Calculate winnings based on odds
                odds = float(winner.get("odds", 1.0))
                bet_amount = winner.get("amount", 1)
                payout_amount = int(bet_amount * odds)  # Convert to int for sats
                
                # Create invoice from winner's wallet
                invoice = client.create_invoice(
                    wallet_key=winner["wallet_inkey"],
                    amount_sats=payout_amount,
                    memo=f"Winnings from {match_id}: {winning_outcome}"
                )
                
                # Pay the invoice from admin wallet
                client.pay_invoice(
                    wallet_adminkey=ADMIN_WALLET_ADMINKEY,
                    invoice=invoice.bolt11
                )
                
                successful_payouts += 1
            except Exception as winner_error:
                print(f"Error paying winner {winner['wallet_inkey']}: {winner_error}")
        
        return ResolveBetResponse(
            success=True,
            message=f"Match resolved with {successful_payouts} winners paid",
            payouts=successful_payouts
        )
    except Exception as e:
        print(f"Error resolving bet: {e}")
        return ResolveBetResponse(success=False, message=f"Error resolving bet: {str(e)}")



