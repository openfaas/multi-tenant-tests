'use strict'

const axios = require('axios')
const querystring = require('querystring')

module.exports = async (event, context) => {

  let gwHealth = "http://gateway.openfaas:8080/healthz"

  let gwListFunctions = "http://gateway.openfaas:8080/system/functions"

  let proBuilderHealth = "http://pro-builder.openfaas:8080/healthz"

  let proBuilderReady = "http://pro-builder.openfaas:8080/ready"

  let promQueryUp = "http://prometheus.openfaas:9090/api/v1/query"

  let promQuery = `avg by (function_name) (gateway_service_count{})`

  let promQueryRaw = querystring.stringify({query: promQuery})

  // 5s timeout for HTTP requests
  const timeout=5000

  let res = {
    "gw-health": 0,
    "gw-list-functions": 0,
    "pro-builder-health": 0,
    "pro-builder-ready": 0,
    "prom-gateway-service-count": {
      status: 0,
      data: {}
    }
  }

  try {
    let health = await axios.get(gwHealth, {timeout: timeout})
    res["gw-health"] = health.status
  } catch (e) {
    if (e.response) {
      res["gw-health"] = e.response.status
    } else {
      res["gw-health"] = 503
    }
  }

  try {
    let proBuilderHealthRes = await axios.get(proBuilderHealth, {timeout: timeout})
    res["pro-builder-health"] = proBuilderHealthRes.status
  } catch (e) {
    if (e.response) {
      res["pro-builder-health"] = e.response.status
    } else {
      res["pro-builder-health"] = 503
    }
  }

  try {
    let proBuilderReadyRes = await axios.get(proBuilderReady, {timeout: timeout})
    res["pro-builder-ready"] = proBuilderReadyRes.status
  } catch (e) {
    if (e.response) {
      res["pro-builder-ready"] = e.response.status
    } else {
      res["pro-builder-ready"] = 503
    }
  }

  try {
    let listFunctions = await axios.get(gwListFunctions, {timeout: timeout})
    res["gw-list-functions"] = listFunctions.status
  }
  catch (e) {
    if (e.response) {
      res["gw-list-functions"] = e.response.status
    } else {
      res["gw-list-functions"] = 503
    }
  }

  try {
    let promQueryUpRes = await axios.get(promQueryUp+`?${promQueryRaw}`, {timeout: timeout})
    res["prom-gateway-service-count"]["status"] = promQueryUpRes.status
    res["prom-gateway-service-count"]["data"] = promQueryUpRes.data
  } catch (e) {
    if (e.response) {
      res["prom-gateway-service-count"]["data"] = e.response.data
      res["prom-gateway-service-count"]["status"] = e.response.status
    } else {
      res["prom-gateway-service-count"]["status"] = 503
    }
  }

  return context
    .status(200)
    .headers({'Content-Type': 'application/json'})
    .succeed(res)
}

