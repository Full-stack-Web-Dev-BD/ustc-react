import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Contract from 'web3-eth-contract';
import { getWalletAddressOrConnect } from '../../wallet';
import Web3 from 'web3';
import { toast } from 'react-toastify';

export default function TicketCard({ details, id }) {

  const abi = require('../pages/abi.json').abi
  const contractAddress = "0x8BD16c4428a6e40F4164C6BeD97A4753E408d43b";
 
  const buy = async (e) => {
    var acc = await getWalletAddressOrConnect()
    console.log("mywc is ", acc);
    if (typeof window.web3 !== 'undefined') {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      var web3Provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3")
      window.web3 = new Web3(web3Provider)
    }
    Contract.setProvider(window.web3.currentProvider);
    var contract = new Contract(abi, contractAddress);
    toast.info("Buyig Ticket")
    const buyedTicket = await contract.methods.buyTickets(details.id).send({ from: acc, value:details.price }) 
    toast.success("Ticket Buying success !!");
    setTimeout(() => {
      window.location.reload()
    }, 1000);

  };  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="194"
        // image={details.imgPath}
        image={`https://picsum.photos/500/300?random=${id}`}
        alt="Paella dish"
      />
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p> <img src="/images/location.png" style={{ width: "30px" }} />  {details.location} </p>
          <p className='badge text-dark' > {details.date} </p>
        </div>
        <p style={{ textTransform: 'capitalize' }}>{details.name}</p>
        <p  >{details.description} </p>
        <div className='text-right'>
          <button onClick={buy} className='d-inline btn mt-3'> Buy in {details.price} Wei  </button>
        </div>
      </CardContent>
    </Card>
  );
}
