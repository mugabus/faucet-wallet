import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import clever_token_abi from './Contracts/clever_token_abi.json'
import Interactions from './Interactions';

const Wallet = () => {

	// deploy simple token contract and paste deployed contract address here. This value is local ganache chain

	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [tokenName, setTokenName] = useState("Token");
    const [errorMessage, setErrorMessage] = useState(null);
    const [balance, setBalance] = useState(null);
	
	



	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
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

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
	}


	
	return (
        <div>
                <h2> {tokenName + " ERC-20 Wallet"} </h2>
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