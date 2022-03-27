import React, { useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );
    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [transactionCount, setTransactionCount] = React.useState(localStorage.getItem('transactionCount '));
    const [currentAccount, setCurrentAccount] = React.useState("");
    const [formData, setFormData] = React.useState({
        addressTo: "",
        amount: "",
        keyword: "",
        message: "",
    });

    const handleChange = (e, name) => {
        setFormData((previousData) => ({
            ...previousData,
            [name]: e.target.value,
        }));
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No accounts found");
            }

            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    };

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            setIsLoading(true);

            ethereum.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: currentAccount,
                        to: addressTo,
                        gas: "0x5208", // 21000 GWEI
                        value: parsedAmount._hex,
                    },
                ],
            });

            const transactionHash = await transactionContract.addToBlockchain(
                addressTo,
                parsedAmount,
                keyword,
                message
            );

            console.log(`Loading: ${transactionHash.hash}`)
            await transactionHash.wait();

            const transactionCountVal = transactionContract.getTransactionCount();
            setTransactionCount(transactionCountVal)
            console.log(transactionCountVal)

            setIsLoading(false);
            console.log(`Done: ${transactionHash.hash}`)
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };

    React.useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                formData,
                isLoading,
                connectWallet,
                handleChange,
                sendTransaction,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
