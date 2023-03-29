// Import
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const https = require('https')
const fetch = require('node-fetch')

require('dotenv').config()

// global varible
const api_key = process.env.API_KEY
const http_port = process.env.HTTP_PORT
const https_port = process.env.HTTPS_PORT
const tls_cert = process.env.TLS_CERT
const tls_key = process.env.TLS_KEY
//const tls_secret = get_tls_secret()
//const client_id = '400508717450-1gfvls1mih0ikvrkpgk2pufh84i4fke5.apps.googleusercontent.com'


// Run express
const app = express()

// Listen on port
app.listen(http_port, () => console.info('Listen on port', http_port))

// HTTPS

const tls_secret = {
    key: tls_key,
    cert: tls_cert
}

https
    .createServer(tls_secret, app)
    .listen(https_port, () => {
        console.info('Listen on port', https_port)
    })

// Log
app.use(morgan('combined'))

// Static file
app.use(express.static('public'))

// Read json data
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API login
app.post('/login', (req, res) => {
    console.info(req.body)

    // Read varible from request body
    const queryString = new URL(req.headers.referer)
    const params = queryString.searchParams
    const ue_ip = params.get('uip')
    const ue_mac = params.get('client_mac')
    const user_name = req.body.user_name
    const user_password = req.body.user_password

    // Get value from params
    const nbi = params.get('nbiIP')
    if (!nbi) return
    const requestURL = 'https://' + nbi + ':443/portalintf'

    // Prepare client authentication body
    let clientAuthenticationBody = {
        Vendor: 'Ruckus',
        RequestUserName: 'api',
        RequestPassword: api_key,
        APIVersion: '1.0',
        RequestCategory: 'UserOnlineControl',
        RequestType: 'Login',
        'UE-IP': ue_ip,
        'UE-MAC': ue_mac,
        'UE-Username': user_name,
        'UE-Password': user_password,
    }

    // Debug
    console.info(clientAuthenticationBody)


    // Check the nbiIP before fetch
    if (nbi) {
        console.info('Start to fetch')

        // Request authentication
        fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientAuthenticationBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.info('Success:', data)

                // Send result to frontend
                res.send(JSON.stringify(data))
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    } else {
        console.info('Skip fetch')

        // Send result to frontend
        res.send(JSON.stringify(
            { status: 'Skip fetch' }
        ))
    }
})

// API decrypt IP
app.post('/decrypt_ip', (req, res) => {
    console.info(req.body)

    // Read varible from request body
    const queryString = new URL(req.body.user_url)
    const params = queryString.searchParams
    const ue_ip = params.get('uip')

    // Get value from params
    const nbi = params.get('nbiIP')
    const requestURL = 'https://' + nbi + ':443/portalintf'

    // Prepare request body
    let request_body = {
        Vendor: 'Ruckus',
        RequestUserName: 'api',
        RequestPassword: api_key,
        APIVersion: '1.0',
        RequestCategory: 'GetConfig',
        RequestType: 'DecryptIP',
        'UE-IP': ue_ip,
    }

    // Debug
    console.info(request_body)


    // Check the nbiIP before fetch
    if (nbi) {
        console.info('Start to fetch')

        // Request authentication
        fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request_body),
        })
            .then((response) => response.json())
            .then((data) => {
                console.info('Success:', data)

                // Send result to frontend
                res.send(JSON.stringify(data))
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    } else {
        console.info('Skip fetch')

        // Send result to frontend
        res.send(JSON.stringify(
            { status: 'Skip fetch' }
        ))
    }
})


