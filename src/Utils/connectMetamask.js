import { ethers } from "ethers";
import { toast } from "react-toastify";

export const isMetamaskInstalled = () => {
  return typeof window !== "undefined" && window.ethereum !== undefined;
};

export const installMetamask = () => {
  window.open("https://metamask.io/", "_blank");
};

export const connectMetamask = async () => {
  if (!isMetamaskInstalled()) {
    toast.error("No Metamask detected. Please install Metamask to continue.");
    return { signer: null, provider: null };
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return { signer, provider };
  } catch (error) {
    console.error("MetaMask connection error:", error);
    toast.error("Failed to connect to Metamask.");
    return { signer: null, provider: null };
  }
};

export const checkIfWalletIsConnect = async (setAccount) => {
  if (!isMetamaskInstalled()) {
    console.log("Metamask is not installed");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length) {
      setAccount(accounts[0]);
    } else {
      console.log("No accounts found");
    }
  } catch (error) {
    console.error("Error checking wallet connection:", error);
  }
};

export const requestAccount = async (setAccount) => {
  if (!isMetamaskInstalled()) {
    toast.error("No Metamask detected. Please install Metamask to continue.");
    return null;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length) {
      const account = accounts[0];
      setAccount(account);
      return account;
    }

    toast.error("No accounts found. Please unlock your MetaMask wallet.");
    return null;
  } catch (error) {
    console.error("Error requesting account access:", error);
    toast.error("Failed to connect wallet. Please try again.");

    return null;
  }
};

export const handleWalletConnect = async (setAccount) => {
  if (!isMetamaskInstalled()) {
    toast.info("Please install MetaMask to use this feature");
    return false;
  }

  const account = await requestAccount(setAccount);
  return !!account;
};