const ACCESS_KEY = 'API0LMVW61U8VAO7OCJ9ZC83F'
const SECRET_KEY = 'eN43BmeSto8ARyGoSc3IbZW5bMln_IG8xaapnivaWfaFuPCYSOQVRR0WVfTygSs0'
const TIMESTAMP = '20220613T163938Z'
const TIME = '20220613'
const TOKEN = '401c5796027d118e4345cd3ad91695ccd7ac66dee65b95deaec8ac111f6d1896'
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
