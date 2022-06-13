const ACCESS_KEY = process.env.REACT_APP_NODEFLUX_ACCESS_KEY
const SECRET_KEY = process.env.REACT_APP_NODEFLUX_SECRET_KEY
const TIMESTAMP = process.env.REACT_APP_NODEFLUX_TIMESTAMP
const TIME = process.env.REACT_APP_NODEFLUX_TIME
const TOKEN = process.env.REACT_APP_NODEFLUX_TOKEN
const AUTHORIZATION = `NODEFLUX-HMAC-SHA256 Credential=${ACCESS_KEY}/${TIME}/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, SignedHeaders=x-nodeflux-timestamp, Signature=${TOKEN}`

export const nodefluxAuthentication = async () => {
    try{
        const res = await fetch('/signatures', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "access_key": ACCESS_KEY,
	            "secret_key": SECRET_KEY
            })
        })
        const auth = await res.json()
        const TIMESTAMP = auth.headers['x-nodeflux-timestamp']
        const TIME = TIMESTAMP.slice(0, 8)
        const TOKEN = auth.token

        return{
            'Authorization': `NODEFLUX-HMAC-SHA256 Credential=${ACCESS_KEY}/${TIME}/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, SignedHeaders=x-nodeflux-timestamp, Signature=${TOKEN}`,
            'x-nodeflux-timestamp': `${TIMESTAMP}`
        }
    }catch (err){
        console.log(err)
    }
}

export const nodefluxEnrollment = async (image) => {
    try{
        const res = await fetch('/create-face-enrollment', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': AUTHORIZATION,
                'x-nodeflux-timestamp': TIMESTAMP
            },
            body: JSON.stringify({
                "images": [
                    image
                ]
            })
        })
        const reply = await res.json()
        return reply

    }catch (err){
        console.log(err)
    }
}

export const nodefluxMatch = async (image, faceId) => {
    try{
        const res = await fetch('/face-match-enrollment', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': AUTHORIZATION,
                'x-nodeflux-timestamp': TIMESTAMP
            },
            body: JSON.stringify({
                "additional_params": {
                    "auto_orientation": false,
                    "face_id": faceId
                },
                "images": [
                    image
                ]
            })
        })
        const reply = await res.json()
        return reply

    }catch (err){
        console.log(err)
    }
}