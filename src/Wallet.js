import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers correctly
import styles from './Wallet.module.css';
import clever_token_abi from './Contracts/clever_token_abi.json';
import Interactions from './Interactions';

const Wallet = () => {
    let contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [tokenName, setTokenName] = useState("Token");
    const [errorMessage, setErrorMessage] = useState(null);
    const [balance, setBalance] = useState(null);
    const [contract, setContract] = useState(null); // Define contract state
    const [provider, setProvider] = useState(null); // Define provider state
    const [signer, setSigner] = useState(null); // Define signer state

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                })
                .catch(error => {
                    setErrorMessage(error.message);
                });
        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);
        let tempContract = new ethers.Contract(contractAddress, clever_token_abi, tempSigner);
        setContract(tempContract);
    }

    useEffect(() => {
        if (contract != null) {
            updateBalance();
            updateTokenName();
        }
    }, [contract]);

    const updateBalance = async () => {
        if (contract && defaultAccount) {
            let balanceBigN = await contract.balanceOf(defaultAccount);
            let balanceNumber = balanceBigN.toNumber();
            let tokenDecimals = await contract.decimals();
            let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);
            setBalance(tokenBalance);
        }
    }

    const updateTokenName = async () => {
        if (contract) {
            setTokenName(await contract.name());
        }
    }

    return (
        <div>
            <h2>{tokenName + " ERC-20 Wallet"}</h2>
            <button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

            <div className={styles.walletCard}>
                <div>
                    <h3>Address: {defaultAccount}</h3>
                </div>

                <div>
                    <h3>{tokenName} Balance: {balance}</h3>
                </div>

                {errorMessage}
            </div>

        </div>
    )
}

export default Wallet;
