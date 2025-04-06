# Models for LNbits interaction
# Define data structures or Pydantic models here if needed 

from typing import NamedTuple

# Define data structures for clarity
class Account(NamedTuple):
    id: str
    name: str
    adminkey: str
    # Add other relevant fields from LNbits API response if needed

class Wallet(NamedTuple):
    id: str
    name: str
    adminkey: str
    inkey: str
    balance_msat: int # Added balance field (usually in msats)
    # Add other relevant fields

class Invoice(NamedTuple):
    payment_hash: str
    payment_request: str
    checking_id: str
    # Add other relevant fields

class PaymentResult(NamedTuple):
    payment_hash: str
    checking_id: str
    # Add other relevant fields

# You could also consider using Pydantic models for more robust validation
# Example with Pydantic (requires `pip install pydantic`):
# from pydantic import BaseModel
# class Account(BaseModel):
#     id: str
#     name: str
#     adminkey: str 