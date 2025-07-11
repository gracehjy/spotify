const express = require('express'); // web server framework
const cors = require('cors'); // allows angular (port 4200) to talk to backend (port 3000)
const axios = require('axios'); // HTTP client for making requests
const qs = require('qs'); // query string parser for formatting data in the request body

const app = express();
app.use(cors());
app.use(express.json());

const clientId = '0285ad106d274f4499bd18ce25443809';
const clientSecret = 'f98f7389ee754847b2e49a6ebd4e8dd8';
const redirectUri = 'http://localhost:4200/callback';

app.post('auth/token', async (req, res) => {
    const code = req.body.code;
    try {
        // send post request to Spotify API to exchange the authorization code for an access token
        const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirectUri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        );

        // return the access token to the client
        res.json(response.data);
    } catch (error) {
        console.error(error.response.data);
        res.status(400).send(error.response.data);
    }
});

app.listen(3000, () => {
    console.log('Auth server running on http://localhost:3000');
}
);