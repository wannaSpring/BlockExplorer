import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockInfo, setBlockInfo] = useState();

  useEffect(() => {
    try {
      getBlockNumber().then(blockNumber => {
        fetchBlockInfoWithTxs(blockNumber).then(info => {
          setBlockNumber(blockNumber)
          setBlockInfo(info);
          console.log(info)
        })
      })
    } catch (err) {
      console.log(err)
    }
  });


  async function fetchBlockInfoWithTxs(blockNumber) {
    return await alchemy.core.getBlockWithTransactions(blockNumber);
  }

  async function getBlockNumber() {
    return await alchemy.core.getBlockNumber()
  } 

  async function handleTractTxs (hash) {
    const {from, value, to} = await alchemy.core.getTransaction(hash)
    // console.log()
    alert(`${from} send ${Utils.formatEther(parseInt(value._hex).toString())} wei to ${to}`)
  }

  return <div className="App">
    <div className='head'>
      <div>baseFeePerGas: {blockInfo?.baseFeePerGas._hex}</div>
      <div>gasLimit: {blockInfo?.gasLimit._hex}</div>
      <div> transactions: {
        blockInfo?.transactions.map(item => {
          return (
            <div className='item' style={{width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer'}} onClick={() => handleTractTxs(item.hash)}>
              <div style={{flex: 2, display: 'inline-block', overflow:'hidden', textOverflow:'ellipsis', textDecoration:'underline'}}>hash: {item?.hash}</div>
              <div style={{flex: 1}}>gasLimit: {item?.gasLimit?._hex}</div>
              <div style={{flex: 1}}>gasPrice: {item?.gasPrice?._hex}</div>
            </div>
          )
        })
      }</div>
    </div>
  </div>;
}

export default App;
