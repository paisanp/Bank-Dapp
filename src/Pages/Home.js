import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import BankAbi from '../abi/bank.json';
import { shortenAddress } from './shortenAddress';

function Home() {
    const [address, setAddress] = useState("Not connect waller");
    const [balanceMetaMask, setBalanceMetaMask] = useState(0);
    const [balance, setBalance] = useState(0);
    const [message, setMessage] = useState("");
    const [connect, setConnect] = useState(false);
    const [checkNotMetaMask, setCheckNotMetaMask] = useState(false);
    const [data, setData] = useState(null);

    let contractAddress = '0x47EE60124964bB03c700fDEdBB270581Fd948C33';
    let web3 = null;

    useEffect(() => {
        async function fetchsData() {
            const result = await fetchData();
            setData(result);
        }
        fetchsData();
    }, []);

    const fetchData = async () => {
        // detectCurrentProvider();
        web3 = new Web3('https://sepolia.infura.io/v3/d472511774de47b39ea151022c7d3d1d');
        window.contract = new web3.eth.Contract(BankAbi, contractAddress);

        const events = await window.contract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 'latest' });

        return events.reverse();
    }
    
    const detectCurrentProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        } else if (window.web3) {
            provider = window.web3.currentProvider;
        } else {
            setCheckNotMetaMask(true);
            setMessage("Non-ethereum browser detected. You should install Metamask");
        }
        return provider;
    };
      
    const connectWaller = async() => {
        try {
            const currentProvider = detectCurrentProvider();
            if(currentProvider) {
                if(checkNotMetaMask){
                    web3 = new Web3('https://sepolia.infura.io/v3/d472511774de47b39ea151022c7d3d1d');
                }else {
                    web3 = new Web3(currentProvider);
                    window.contract = new web3.eth.Contract(BankAbi, contractAddress);
                    const Account = await web3.eth.getAccounts();
                    const address = Account[0];
                    let BalanceMetaMask = await web3.eth.getBalance(address);
                    let ethBalanceMetaMask = BalanceMetaMask / 10 ** 18;
                    let Balance = await window.contract.methods.balanceOf(address).call()
                    let ethBalance = Balance / 10 ** 18;
                    setAddress(address);
                    setBalanceMetaMask(ethBalanceMetaMask.toFixed(5));
                    setBalance(ethBalance);
                    setConnect(true);
                }
            }
        } catch(err) {
            console.log(err);
        }
    }

    const onDisconnect = () => {
        setAddress("Not connect waller");
        setBalanceMetaMask(0);
        setBalance(0);
        setMessage("");
        setConnect(false);
        setCheckNotMetaMask(false);
    }

    const deposit = async () => {
        if(!connect) {
            alert("Please connect waller metamask")
            return;
        }
        let amount = prompt(`Balance Metamask: ${balanceMetaMask} ETH \nAmount to deposit (ETH)`)

        if (parseFloat(amount) <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }
        const currentProvider = detectCurrentProvider();
        await currentProvider.request({method: 'eth_requestAccounts'});
        web3 = new Web3(currentProvider);

        window.contract = new web3.eth.Contract(BankAbi, contractAddress);
        
        const WeiAmount = web3.utils.toHex?.(web3.utils.toWei(amount, 'ether'))
        const txParams = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            value: WeiAmount,
            data: window.contract.methods.deposit().encodeABI(),
        }

        try {
            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txParams, 'latest'],
            })
                alert('Transaction Successful. Refresh in a moment.')
          } catch (error) {
                alert('Transaction Failed' + error.message)
          }
    }

    const withdraw = async () => {
        if(!connect) {
            alert("Please connect waller metamask")
            return;
        }

        let amount = prompt(`Balance Metamask: ${balanceMetaMask} ETH \nAmount to withdraw (ETH)`)

        if (parseFloat(amount) <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }
        const currentProvider = detectCurrentProvider();
        await currentProvider.request({method: 'eth_requestAccounts'});
        web3 = new Web3(currentProvider);

        window.contract = new web3.eth.Contract(BankAbi, contractAddress);

        const WeiAmount = web3.utils.toWei(amount, 'ether')

        const txParams = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            data: window.contract.methods.withdraw(WeiAmount).encodeABI(),
        }

        try {
            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txParams, 'latest'],
            })
            alert('Transaction Successful. Refresh in a moment') 
        } catch (error) {
            alert('Transaction Failed' + error.message)
        }
    }
    
    const transfer = async () => {
        if(!connect) {
            alert("Please connect waller metamask")
            return;
        }

        let to = prompt(`Address to transfer (Ex. 0xF2730...56f5)`)

        let amount = prompt(`Balance Metamask: ${balanceMetaMask} ETH \nAmount to transfer (ETH)`)
        
        if (parseFloat(amount) <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }

        const currentProvider = detectCurrentProvider();
        await currentProvider.request({method: 'eth_requestAccounts'});
        web3 = new Web3(currentProvider);

        window.contract = new web3.eth.Contract(BankAbi, contractAddress);

        const WeiAmount = web3.utils.toWei(amount, 'ether')

        const txParams = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            data: window.contract.methods.transfer(to, WeiAmount).encodeABI(),
        }

        try {
            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txParams, 'latest'],
            })
            alert('Transaction Successful. Refresh in a moment') 
        } catch (error) {
            alert('Transaction Failed' + error.message)
        }
    }
    

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <h1>Bank Web3</h1>
        <div style={{ border: '1px solid', margin: "0px 30% 0px 30%" }}>
            <h3>MetaMask Waller</h3>
            <h5>Your Address: {address}</h5>
            <h5>Balance MetaMask: {balanceMetaMask} ETH</h5>
            <div style={{ display: "flex", gap: "1rem", margin: "0px 25% 0px 25%"  }}>
                <button onClick={connectWaller}>Connect MM Waller</button>
                <button onClick={onDisconnect}>Disconnect</button>
            </div>
            <br/><br/>
        </div>
        <div style={{ color: "#FF0000" }}>{message}</div>
        <h3>Balance: {balance} ETH</h3>
        <div>
            <button onClick={deposit}>Deposit</button>
            <button onClick={withdraw}>Withdraw</button>
            <button onClick={transfer}>Transfer</button>
        </div>
        <br/><br/>
        <hr/>

        <h2>Latest Transactions</h2>
        {data.map((d, i) =>{
            if(d.event === "Transfer"){
                return <div key={i}>
                            <div style={{ border: '1px solid', margin: "0px 30% 0px 30%" }}>
                                <h5>From: {d.returnValues.from}</h5>
                                <h5>To: {shortenAddress(d.returnValues.to)}</h5>
                                <h5>Event: {d.event}</h5>
                                <p>amount: {d.returnValues.amount / 10 ** 18}</p>
                                <p>Time: {new Date(d.returnValues.timestamp * 1000).toLocaleString()}</p>
                            </div>
                            <br/>
                        </div>
            } else {
                return <div key={i}>
                            <div style={{ border: '1px solid', margin: "0px 30% 0px 30%" }}>
                                <h5>Address: {d.returnValues.owner}</h5>
                                <h5>Event: {d.event}</h5>
                                <p>amount: {d.returnValues.amount / 10 ** 18}</p>
                                <p>Time: {new Date(d.returnValues.timestamp * 1000).toLocaleString()}</p>
                            </div>
                            <br/>
                        </div>
            }
        })}
    </>
    )
}

export default Home