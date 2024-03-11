import axios from "axios"

const link = 'http://localhost:3000/check/register-login';


export const login = async (e: React.FormEvent<HTMLFormElement>, mode: "Register" | "Login", validationError: { username: boolean, password: boolean }, acceptCredentials: React.Dispatch<React.SetStateAction<boolean>>) => {
    const form = e.currentTarget as HTMLFormElement; // Cast to HTMLFormElement
    const usernameVal = form.username.value;
    const passwordVal = form.password.value;

    if ((usernameVal && !validationError.username && !validationError.password) || mode === 'Login') {
        const body = { username: usernameVal, password: passwordVal, mode: mode }
        await axios.post(link, body)
            .then(res => {
                alert(res.data)
                acceptCredentials(true)
            })
            .catch((err) => {
                // display error in an alert
                if (err.response && err.response.data) alert(err.response.data.message)
                else alert('Error, Could Not Make User')
            })
    }
}

interface Input {
    name: string;
    description: string;
    id: string;
}

export interface Inputs {
    [key: string]: Input;
}

export interface fields {
    username: string,
    password: string
}

export const inputs: Inputs = {
    username: {
        name: 'User Name',
        description: 'Pick a Unique User Name!',
        id: 'username'
    },

    password: {
        name: 'Password',
        description: 'Choose as Strong Password!',
        id: 'password'
    }
}

export const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'username' | 'password', fields: fields, setFields: React.Dispatch<React.SetStateAction<fields>>) => {
    //set placeholder to change field
    let placeholder = fields
    placeholder = {
        ...fields,
        [field]: e.target.value
    }
    setFields(placeholder)
}

export class sendLogoutRequest {
    type: 'logoutRequest'
    username: string
    constructor(username: string) {
        this.type = 'logoutRequest'
        this.username = username
    }
}

export const logout = (ws: WebSocket, username: string) => {
    const logoutRequest = new sendLogoutRequest(username)
    ws.send(JSON.stringify(logoutRequest))
    ws.close()
}