import {ethers} from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const buttonConnect = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalanceButton = document.getElementById("getBalanceButton")
const withdrawButton = document.getElementById("withdrawButton")
buttonConnect.onclick = connect
fundButton.onclick = fund
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
//connect
async function connect() {
  if(window.ethereum && window.ethereum.isMetaMask)
  {
    try{
      await window.ethereum.request({method : 'eth_requestAccounts'})
      buttonConnect.innerHTML = "Connected !"
    } catch(error){
      buttonConnect.innerHTML = "Fail !"
    }
  }
  else
  {
    console.log('metamask is not installed')
  }
}

//fund
async function fund(){
  let ethAmount;
  try {
    ethAmount = document.getElementById("fund").value;
  } catch (e) {
    console.log(e)
  }

  //provider
  //accounts
  //ABI + adresse du contrat
  if(window.ethereum && window.ethereum.isMetaMask)
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer   = provider.getSigner()
    const fundMeContract = new ethers.Contract(contractAddress, abi, signer)
    try{
      const transactionResponse = await fundMeContract.fund({value : ethers.utils.parseEther(ethAmount)})
      await listenerTransactionMine(transactionResponse, provider).then((resolve, error) => {
        if(resolve)
        {
          console.log(resolve)
        }
        else
        {
          console.log(error)
        }
      });
    }catch(error){
      console.log(error)
    }
  }
  else
  {
    console.log("metamask is not connected")
  }
}

//Promise
function listenerTransactionMine(transactionResponse, provider)
{
  console.log(`mining ${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations} confirmation`)
      resolve('Done')
    })
  })
}

//withdraw
async function withdraw(){
    if(window.ethereum && window.ethereum.isMetaMask)
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const fundMeContract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await fundMeContract.cheaperWithdraw()
        await listenerTransactionMine(transactionResponse, provider)
      } catch (e) {
        console.log(e)
      }
    }
}

//getBalance
async function getBalance(){
  if(window.ethereum && window.ethereum.isMetaMask)
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balanceWei = await provider.getBalance(contractAddress)
    const amountInETH = ethers.utils.formatEther(balanceWei)
    console.log(amountInETH)
  }
}
