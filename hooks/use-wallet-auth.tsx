"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface WalletAuthContextType {
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => void
  satBalance: number
  refreshBalance: () => Promise<void> // Add this function
}

const WalletAuthContext = createContext<WalletAuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  satBalance: 0,
  refreshBalance: async () => {} // Initialize with empty function
})

export function WalletAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [satBalance, setSatBalance] = useState(0)

  // Simulate loading wallet state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("lightning-auth")
    if (storedAuth) {
      setIsAuthenticated(true)
      setSatBalance(Math.floor(Math.random() * 1000000) + 100000) // Random balance for demo
    }
  }, [])

  // const login = async () => {
  //   // Simulate LNURL-auth flow
  //   // await new Promise((resolve) => setTimeout(resolve, 1500))

  //   // // In a real app, this would verify the authentication with the Lightning node
  //   // setIsAuthenticated(true)
  //   // setSatBalance(Math.floor(Math.random() * 1000000) + 100000) // Random balance for demo
  //   // localStorage.setItem("lightning-auth", "true")
    
  // }


//   const getWalletBalance = async () => {
//   try {
//     // Get the wallet inkey from local storage
//     const walletInkey = localStorage.getItem('wallet_inkey');
    
//     if (!walletInkey) {
//       console.error('No wallet inkey found in local storage');
//       return null;
//     }
    
//     // Call the balance API
//     const response = await fetch(`http://localhost:8000/api/balance/${walletInkey}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
    
//     const data = await response.json();
    
//     if (data.success) {
//       // Update the balance in your state/UI
//       setSatBalance(data.balance);
//       return data.balance;
//     } else {
//       console.error('Failed to get balance:', data.message);
//       // You might want to handle this error in your UI
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching balance:', error);
//     return null;
//   }
// };


const getWalletBalance = async () => {
  try {
    // Get the wallet inkey from local storage
    const walletInkey = localStorage.getItem('wallet_inkey');
    
    if (!walletInkey) {
      console.error('No wallet inkey found in local storage');
      return null;
    }
    
    // Use the correct port (80 instead of 8000)
    const response = await fetch(`http://127.0.0.1:80/api/balance/${walletInkey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log("Balance API response:", data); // Debug log
    
    if (data.success) {
      console.log("New balance:", data.balance); // Debug log
      return data.balance;
    } else {
      console.error('Failed to get balance:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};

const login = async () => {
  try {
    const username =  "USER"
    
    if (!username) {
      alert('Please enter a username');
      return;
    }
    
    const response = await fetch('http://127.0.0.1:80/api/create-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store wallet credentials in local storage
      localStorage.setItem('wallet_id', data.wallet_id);
      localStorage.setItem('wallet_adminkey', data.adminkey);
      localStorage.setItem('wallet_inkey', data.inkey);
      localStorage.setItem('username', username);
      
      console.log('Wallet created successfully');
      alert('Wallet created successfully!');
      
      // Here you might want to redirect to your main app or dashboard
      // window.location.href = '/dashboard';



      const balance = await getWalletBalance();


      setIsAuthenticated(true)
      setSatBalance(balance || 0);
      
      return data;
    } else {
      console.error('Wallet creation failed:', data.message);
      alert(`Failed: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error connecting to server');
    return null;
  }
};

  const logout = () => {
    setIsAuthenticated(false)
    setSatBalance(0)
    localStorage.removeItem("lightning-auth")
  }

const refreshBalance = async () => {
  console.log("Context refreshBalance called");
  try {
    const walletInkey = localStorage.getItem('wallet_inkey');
    
    if (!walletInkey) {
      console.error('No wallet inkey found in local storage');
      return null;
    }
    
    const response = await fetch(`http://127.0.0.1:80/api/balance/${walletInkey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log("Balance API raw response:", data);
    
    if (data.success) {
      const balance = data.balance;
      console.log("Setting new balance in context:", balance);
      setSatBalance(balance);
      return balance;
    } else {
      console.error('Failed to get balance:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};

  return (
    <WalletAuthContext.Provider value={{ isAuthenticated, login, logout, satBalance, refreshBalance }}>
      {children}
    </WalletAuthContext.Provider>
  )
}

export function useWalletAuth() {
  return useContext(WalletAuthContext)
}

