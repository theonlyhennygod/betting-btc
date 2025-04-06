import requests
import json
# Removed NamedTuple import as models are now separate
from .models import Account, Wallet, Invoice, PaymentResult

# Removed NamedTuple definitions for Account, Wallet, Invoice, PaymentResult

class LNbitsError(Exception):
    """Custom exception for LNbits API errors."""
    pass

class LNbits:
    """A basic client for interacting with an LNbits instance."""

    def __init__(self, base_url: str):
        """Initialize the client with the base URL of the LNbits instance."""
        if not base_url.startswith("http"):
            base_url = f"https://{base_url}"
        self.base_url = base_url.rstrip('/')
        print(f"LNbits client initialized for URL: {self.base_url}")

    def _make_request(self, method: str, endpoint: str, api_key: str = None, **kwargs):
        """Helper method to make HTTP requests to the LNbits API."""
        url = f"{self.base_url}{endpoint}"
        headers = {}
        if api_key:
            headers["X-Api-Key"] = api_key
        
        try:
            response = requests.request(method, url, headers=headers, **kwargs)
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"HTTP Request failed: {e}")
            # Attempt to parse error details from LNbits response if available
            error_detail = "Unknown error"
            try:
                error_detail = response.json().get('detail', 'Unknown error')
            except: # Handle cases where response is not JSON or doesn't have 'detail'
                pass
            raise LNbitsError(f"API request to {endpoint} failed: {error_detail}") from e
        except json.JSONDecodeError:
             raise LNbitsError(f"Failed to decode JSON response from {endpoint}")

    def create_account(self, name: str) -> Account:
        """Creates a new user account."""
        print(f"Attempting to create account: {name}")
        # Note: LNbits account creation might be manual or handled differently depending on deployment
        # This is a placeholder assuming an endpoint exists, which might not be standard.
        # You might need to manage accounts/users directly in your LNbits instance.
        
        # Placeholder: Simulate account creation if no direct API endpoint exists
        # In a real scenario, you might fetch admin key from config or environment variables
        print("Placeholder: Simulating account creation.")
        # Replace with actual logic if an API endpoint becomes available or use pre-configured keys
        return Account(id="simulated_admin_id", name=name, adminkey="simulated_admin_key")

        # --- Example if an endpoint existed (replace with actual if available) ---
        # try:
        #     # Assuming a hypothetical endpoint '/api/v1/admin/users'
        #     # The actual endpoint and payload might differ significantly
        #     data = self._make_request('POST', '/api/v1/admin/users', json={'admin_name': name}, api_key=YOUR_SUPER_USER_KEY) # Requires super user key
        #     print(f"Account creation response: {data}") 
        #     # Adapt the Account NamedTuple creation based on the actual API response structure
        #     return Account(id=data.get('id'), name=data.get('name'), adminkey=data.get('adminkey'))
        # except LNbitsError as e:
        #     print(f"Failed to create account '{name}': {e}")
        #     raise
        # --------------------------------------------------------------------------

    def create_wallet(self, account_api_key: str, name: str) -> Wallet:
        """Creates a new wallet for a user."""
        print(f"Attempting to create wallet: {name}")
        try:
            data = self._make_request(
                'POST',
                '/api/v1/wallet',
                api_key=account_api_key,
                json={'name': name}
            )
            print(f"Wallet creation response: {data}")
            # Ensure the keys exist in the response
            if not all(k in data for k in ['id', 'adminkey', 'inkey', 'name']):
                raise LNbitsError(f"Incomplete data received for wallet '{name}' creation.")
            return Wallet(id=data['id'], name=data['name'], adminkey=data['adminkey'], inkey=data['inkey'])
        except LNbitsError as e:
            print(f"Failed to create wallet '{name}': {e}")
            raise

    def create_invoice(self, wallet_key: str, amount_sats: int, memo: str) -> Invoice:
        """Creates a new invoice."""
        print(f"Attempting to create invoice for {amount_sats} sats with memo: {memo}")
        try:
            payload = {
                "out": False, # We are creating an invoice to receive funds
                "amount": amount_sats,
                "memo": memo,
                # Add other optional parameters like expiry, webhook, etc. if needed
            }
            data = self._make_request(
                'POST',
                '/api/v1/payments',
                api_key=wallet_key, # Use invoice/read key
                json=payload
            )
            print(f"Invoice creation response: {data}")
            if not all(k in data for k in ['payment_hash', 'payment_request', 'checking_id']):
                 raise LNbitsError("Incomplete data received for invoice creation.")
            return Invoice(payment_hash=data['payment_hash'], payment_request=data['payment_request'], checking_id=data['checking_id'])
        except LNbitsError as e:
            print(f"Failed to create invoice: {e}")
            raise

    def pay_invoice(self, wallet_adminkey: str, invoice: str) -> PaymentResult:
        """Pays an invoice."""
        print(f"Attempting to pay invoice: {invoice[:30]}..." ) # Print prefix for brevity
        try:
            payload = {
                "out": True, # We are paying an invoice
                "bolt11": invoice
            }
            data = self._make_request(
                'POST',
                '/api/v1/payments',
                api_key=wallet_adminkey, # Use admin key for paying out
                json=payload
            )
            print(f"Payment response: {data}")
            if not all(k in data for k in ['payment_hash', 'checking_id']):
                 raise LNbitsError("Incomplete data received for payment.")
            return PaymentResult(payment_hash=data['payment_hash'], checking_id=data['checking_id'])
        except LNbitsError as e:
            print(f"Failed to pay invoice: {e}")
            raise

    def check_invoice_status(self, wallet_key: str, payment_hash: str):
        """Checks the status of an invoice/payment."""
        print(f"Checking status for payment hash: {payment_hash}")
        try:
            data = self._make_request(
                'GET',
                f'/api/v1/payments/{payment_hash}',
                api_key=wallet_key # Use invoice/read key
            )
            print(f"Payment status response: {data}")
            return data # Returns payment details, including 'paid': True/False
        except LNbitsError as e:
            print(f"Failed to check payment status: {e}")
            raise

    def get_wallet_details(self, wallet_key: str) -> Wallet:
        """Fetches details for a specific wallet, including balance."""
        print(f"Fetching details for wallet associated with key: {wallet_key[:10]}...")
        try:
            data = self._make_request(
                'GET',
                '/api/v1/wallet', # Endpoint to fetch wallet details
                api_key=wallet_key # Use invoice/read key
            )
            print(f"Wallet details response: {data}")
            # Ensure the necessary keys exist in the response
            # Adjust keys based on actual LNbits response (e.g., 'balance')
            if not all(k in data for k in ['id', 'adminkey', 'inkey', 'name', 'balance']):
                 raise LNbitsError("Incomplete data received for wallet details.")
            # LNbits typically returns balance in millisatoshis
            return Wallet(
                id=data['id'], 
                name=data['name'], 
                adminkey=data['adminkey'], 
                inkey=data['inkey'],
                balance_msat=data['balance'] 
            )
        except LNbitsError as e:
            print(f"Failed to get wallet details: {e}")
            raise 