// Get URL
const queryString = new URL(document.URL)
console.info(queryString)

// Handle generate button event
async function generate_button() {
    //const anonymous_user_name = 'user03'
    //const anonymous_user_password = 'user03'

    console.info('Click generate button')

    // Prepare user information
    async function fetchData(url) {
        const response = await fetch(url)
        const data = await response.json()
        return data
    }

    const anonymou_info = await fetchData('/anonymous')
    console.log('anonymou_info', anonymou_info)

    const data = {
        user_name: anonymou_info.user_name,
        user_password: anonymou_info.user_password,
        user_url: queryString
    }

    // POST to backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.info('Success:', data)

            // Read backend response
            document.getElementById('result').innerHTML = data.ReplyMessage

            // Check login status
            if (data.ReplyMessage != 'Login succeeded') return

            document.getElementById('generate').disabled = true

            // Set timer 3 sec
            setTimeout(() => {
                // Reload
                window.location.href = '/next.html'
            }, 3000)
        })
        .catch((error) => {
            console.error('Error:', error)
        })

}

// Listen to click event
document.getElementById('generate').addEventListener('click', generate_button)
