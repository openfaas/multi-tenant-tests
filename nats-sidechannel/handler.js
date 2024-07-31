'use strict'

const connect = require('nats').connect;

module.exports = async (event, context) => {
  const nc = await connect({ servers: "nats.openfaas:4222" });

  const js = nc.jetstream();

  let targetFn = "sleep"

  let invokePayload = { 
    "Header": { "Accept-Encoding": ["gzip"], 
      "Content-Length": ["1"], 
      "Content-Type": ["text/plain"], 
      "User-Agent": ["Go-http-client/2.0"],
      "X-Call-Id": ["7e45ce87-0c44-4802-8911-66145051abc1"],
      "X-Forwarded-For": ["10.42.1.94"],
      "X-Forwarded-Host": ["openfaas.example.com"],
      "X-Forwarded-Proto": ["https"],
      "X-Forwarded-Scheme": ["https"],
      "X-Real-Ip": ["10.42.1.94"],
      "X-Request-Id": ["5ada89804abb33d9c2e54c3afa56455d"],
      "X-Scheme": ["https"],
      "X-Sleep": ["5s"],
      "X-Start-Time": ["1722417113602383205"] }, 
  "Host": "openfaas.example.com", 
  "Body": "Cg==", 
  "Method": "POST", 
  "Function": targetFn }

  // publish a message received by a stream
  let pa = await js.publish("faas-request", JSON.stringify( invokePayload));
  console.log("Published message", pa);

  await nc.close()

  const result = {
    'body': JSON.stringify(event.body),
    'content-type': event.headers["content-type"]
  }

  return context
    .status(200)
    .succeed(result)
}

