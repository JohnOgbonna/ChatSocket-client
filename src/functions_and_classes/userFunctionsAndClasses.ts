import axios from "axios"

const link = 'http://localhost:3000/check/register-login';

export const handleSubmit = (e: any, mode: "Register" | "Login", validationError: { username: boolean, password: boolean }, acceptCredentials: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault()
    if (e.target.username.value && !validationError.username && !validationError.password || mode === 'Login') {
        const body = { username: e.target.username.value, password: e.target.password.value, mode: mode }
        axios.post(link, body)
            .then(res => {
                alert(res.data)
                acceptCredentials(true)
            })
            .catch((err) => {
                // display error in an alert
                if (err.response.data.type = 'userExists') alert(err.response.data.message)
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