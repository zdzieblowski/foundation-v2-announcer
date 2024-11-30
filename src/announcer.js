import fetch from 'node-fetch';
import express from 'express';
import asyncHandler from "express-async-handler";

const endpoint = express();
const endpoint_port = 3000;

var api;

async function fetchData(url) {
  let req = await fetch(url);
  let res = req.json();
  return res;
}

// ANNOUNCER

endpoint.get('*', asyncHandler(async (req, res) => {
  console.log(req.url);

  if(req.url=='/EVR'){
   api = 'http://localhost:3001/api/v2/evrmore';
  }
  else if(req.url=='/SKYDOGE'){
   api = 'http://localhost:3001/api/v2/skydoge';
  }

  console.log(`${api}`);

  let metadata = await fetchData(`${api}/current/metadata`);
  let configuration = await fetchData(`${api}/current/configuration`);
  let ports = await fetchData(`${api}/current/ports`);
  let blocks = await fetchData(`${api}/historical/blocks`);
  let network = await fetchData(`${api}/current/network`)

  res.send(Object.assign([{
    'timestamp': metadata.body[0]['timestamp'],
    'miners': metadata.body[0]['miners'],
    'workers': metadata.body[0]['workers'],
    'hashrate': metadata.body[0]['hashrate'],
    'height': network.body[0]['height'],
    'algoritm': configuration.body[0]['algorithm'],
    'minimum_payout': configuration.body[0]['minimumPayment'],
    'fee_percentage': configuration.body[0]['recipientFee']*100,
    'ports': ports.body,
    'last_block_found': blocks.body.at(-1)
  }]));

}));

endpoint.listen(endpoint_port, () => {
  console.log(`Announcer started on ${endpoint_port}. Press CTRL+C to exit.`);
});
