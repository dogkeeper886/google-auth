// Import
const express = require('express')
const morgan = require('morgan')
const https = require('https')
const fs = require('fs')

// global varible
const http_port = 8080
const https_port = 443
//const client_id = '400508717450-1gfvls1mih0ikvrkpgk2pufh84i4fke5.apps.googleusercontent.com'
const api_key = get_api_key()
const tls_secret = get_tls_secret()

// Check environment value and file system
function get_api_key() {

    // Setup varible
    let result = null

    if (fs.existsSync('integration.key')) {
        // Read from file system
        result = fs.readFileSync('integration.key', 'utf-8')

    } else {
        // Read from environment varible
        result = process.env.API_KEY
    }

    // Return result
    return result
}

// Check environment value and file system
function get_tls_secret() {

    // Setup varible
    let tls_cert = null
    let tls_key = null

    if (fs.existsSync('cert.pem') && fs.existsSync('key.pem')) {

        // Read from file system
        tls_cert = fs.readFileSync('cert.pem', 'utf-8')
        tls_key = fs.readFileSync('key.pem', 'utf-8')

    } else {

        // Read from environment varible
        tls_cert = process.env.TLS_CERT
        tls_key = process.env.TLS_KEY
    }

    // Return result
    return {
        key: tls_key,
        cert: tls_cert
    }
}


// Run express
const app = express()

// Listen on port
app.listen(http_port, () => console.info('Listen on port', http_port))

// HTTPS
https
    .createServer(tls_secret, app)
    .listen(443, () => {
        console.info('Listen on port', https_port)
    })


// Log
app.use(morgan('combined'))

// Static file
app.use(express.static('public'))

// Read json data
app.use(express.json())

// API login
app.post('/login', (req, res) => {
    console.info(req.body)

    // Read varible from request body
    const queryString = new URL(req.body.user_url)
    const params = queryString.searchParams
    const ue_ip = params.get('uip')
    const ue_mac = params.get('client_mac')
    const user_name = req.body.user_name
    const user_password = req.body.user_password

    // Get value from params
    const nbi = params.get('nbiIP')
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


