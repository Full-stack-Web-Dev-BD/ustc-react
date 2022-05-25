import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { getWalletAddressOrConnect } from "../../wallet";
import Contract from "web3-eth-contract";
import TicketCard from "../component/TicketCard";
import TicketCardReturn from "../component/TicketCardReturn";
import SingleTicket from "./SingleTicket";

const Market = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true)
  const [myBalance, setMyBalance] = useState(0)
  const [ticketEvent, setTicketEvent] = useState({})
  const [myTickets, setMyTickets] = useState([])
  const [details, setDetails] = useState({})
  useEffect(async () => {
    await fetchData();
  }, []);

  const abi = require("./abi.json").abi;
  const contractAddress = "0x8BD16c4428a6e40F4164C6BeD97A4753E408d43b";

  const fetchData = async (e) => {
    var acc = await getWalletAddressOrConnect();
    console.log("mywc is ", acc);
    if (typeof window.web3 !== "undefined") {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      var web3Provider = new Web3.providers.HttpProvider(
        "https://ropsten.infura.io/v3"
      );
      window.web3 = new Web3(web3Provider);
    }
    Contract.setProvider(window.web3.currentProvider);
    var contract = new Contract(abi, contractAddress);
    console.log(contract);
    const myBalance = await contract.methods.balanceOf(acc).call({ from: acc });
    const totalSell = await contract.methods.totalSell().call();
    console.log("Total sell is ", totalSell);
    setMyBalance(myBalance);
    // console.log("My ticket balance is ", myBalance)
    const eventCount = await contract.methods.eventCount().call({ from: acc });
    console.log("tx is ", eventCount);
    var allEvents = [];
    for (let i = 1; i <= eventCount; i++) {
      var tx = await contract.methods.events(i).call();
      var obj = {};
      obj.name = tx["name"];
      obj.date = tx["date"];
      obj.location = tx["location"];
      obj.imgPath = tx["imgPath"];
      obj.price = tx["price"];
      obj.description = tx["description"];
      obj.id = i;
      allEvents.push(obj);
    }
    var ticketOfEvent = {}
    var myTicketsStore = []
    for (let i = 0; i <= totalSell; i++) {
      var tx = await contract.methods.ticketEvent(i).call();
      if (tx > 0) {
        var owner = await contract.methods.ownerOf(i).call();
        // console.log(owner, acc)
        if (owner.toString().toUpperCase() == acc.toString().toUpperCase()) {
          myTicketsStore.push(i);
        }
        ticketOfEvent[`id${i}`] = tx;
      }
    }
    setMyTickets(myTicketsStore)
    setEvents(allEvents);
    setTicketEvent(ticketOfEvent)
    setLoading(false)
  };

  return (
    <div className="app-content">
      <div className="container">
        <div className="">
        <SingleTicket details={details} />
          {loading ? (
            <div className="row">
              <div className="text-center col-4 offset-4  " style={{ marginTop: '170px' }}>
                <div class="lds-roller">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              
              <h5 className="mb-5 "> Market  </h5>
              <div className="row mb-5">
                {
                  events.map((el, index) => {
                    return (
                      <div style={{cursor:'pointer'}} onClick={e=>{setDetails(el);document.getElementById("modal_opener").click()}} key={index} className="col-md-4 mb-3">
                        <TicketCard details={el} id={index} />
                      </div>
                    );
                  })
                }
              </div>

              <h5 className="mb-5 mt-5"> You have {myBalance} Ticket's on your  Wallet  </h5>
              <div className="row">
                {
                  myTickets.map((el, index) => {
                    return (
                      <div style={{cursor:'pointer'}} key={index} className="col-md-4 mb-3">
                        {console.log("my ticket ID is   ", events[(ticketEvent[`id${el}`])-1])}
                        <TicketCardReturn details={events[(ticketEvent[`id${el}`])-1]} id={index} ticketID ={el} eventID = {ticketEvent[`id${el}`]}  />
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
};
export default Market;
