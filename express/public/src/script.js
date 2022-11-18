// Handle generate button event
function generate_button() {
    const anonymous_user_name = 'user03'
    const anonymous_user_password = 'user03'

    console.info('Click generate button')

    // Prepare user information
    const data = {
        user_name: anonymous_user_name,
        user_password: anonymous_user_password,
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
            if (data.ReplyMessage == 'Login succeeded') {
                document.getElementById('generate').disabled = true

                // Set timer 3 sec
                setTimeout(() => {

                    // Reload
                    window.location.href = '/next.html'
                }, 3000)
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })

}

// Get URL
const queryString = new URL(document.URL)
console.info(queryString)
console.info(queryString.hostname)
// Listen to click event
document.getElementById('generate').addEventListener('click', generate_button)
