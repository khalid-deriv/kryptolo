import React, { useContext } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = useContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const igner = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  console.log(provider, igner, transactionContract);
};

export const TransactionProvider = ({ children }) => {
  return (
    <TransactionContext.Provider value={{ a: "hoorrah!" }}>
      {children}
    </TransactionContext.Provider>
  );
};
