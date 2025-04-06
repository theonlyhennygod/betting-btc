#
#   Written by Pavel Kononov from LightningBounties.com
#   For MIT Bitcoin Hackathon 2025
#
#   Happy hacking!
#

from .service import LNbits


def main() -> None:
    client = LNbits("user123.u.voltageapp.io") # Replace with your LNbits instance URL

    account = client.create_account(name="super-jaba")
    print(f"Account created: {account}")

    wallet1 = client.create_wallet(
        account_api_key=account.adminkey,
        name="my_wallet_1"
    )
    print(f"Wallet 1 created: {wallet1}")

    wallet2 = client.create_wallet(
        account_api_key=account.adminkey,
        name="my_wallet_2"
    )
    print(f"Wallet 2 created: {wallet2}")

    # Get and print wallet 1 details (including balance)
    try:
        wallet1_details = client.get_wallet_details(wallet_key=wallet1.inkey)
        print(f"Wallet 1 Details: ID={wallet1_details.id}, Name={wallet1_details.name}, Balance={wallet1_details.balance_msat / 1000} sats")
    except Exception as e: # Catch potential LNbitsError or other issues
        print(f"Could not fetch details for Wallet 1: {e}")

    # Get and print wallet 2 details (including balance)
    try:
        wallet2_details = client.get_wallet_details(wallet_key=wallet2.inkey)
        print(f"Wallet 2 Details: ID={wallet2_details.id}, Name={wallet2_details.name}, Balance={wallet2_details.balance_msat / 1000} sats")
    except Exception as e:
        print(f"Could not fetch details for Wallet 2: {e}")

    print("\nCreating and paying invoice...")
    invoice = client.create_invoice(
        wallet_key=wallet1.inkey, 
        amount_sats=100, 
        memo="invoice from wallet1"
    )
    print(f"Invoice created: {invoice}")

    payment_result = client.pay_invoice(
        wallet_adminkey=wallet2.adminkey,
        invoice=invoice.payment_request
    )
    print(f"Invoice payment result: {payment_result}")


if __name__ == "__main__":
    main() 