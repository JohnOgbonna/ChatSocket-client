import { useState, useMemo } from "react"
import axios from "axios"
import '../pageStyles.css'
import './homeStyles.css'
import { useNavigate } from "react-router-dom"

const link = 'http://localhost:3000/check/register';

export default function HomePage() {

    const navigate = useNavigate()
    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (e.target.userName.value && !validationError) {
            const body = { username: e.target.userName.value }
            axios.post(link, body)
                .then(res => {
                    alert(res.data)
                    acceptUsername(true)
                })
                .catch((err) => {
                    alert('Error, not registered')
                    console.log(err)
                })
        }
    }

    const [usernameAccepted, acceptUsername] = useState<boolean>(false)
    const [username, setUsername] = useState('')

    const validationError = useMemo(() => {
        const regex = /^[a-zA-Z0-9]+$/;

        if (username.length >= 4 && !username.includes(' ') && regex.test(username)) {
            return false
        } else {
            return true
        }
    }, [username]);

    const handleUsernameChange = (e: any) => {
        setUsername(_prev => e.target.value)
    }
    const navigateToChat = () =>{navigate(`/chat/${username}`)}

    return (
        <div>
            <h2 className="">Welcome!</h2>
            <p>Type in you User name to get started!</p>
            <form className="flex justify-center mt-8 text-[1.2rem]"
                onSubmit={handleSubmit}
            >
                <input
                    type="text" className="mr-[1rem] px-2"
                    id='userName'
                    onChange={handleUsernameChange} />
                <button type="submit" className="border border-white border-solid rounded-md p-1">Register</button>
            </form>
            {validationError && <p className="text-red-600 mt-4">Username must be 4 or more characters, alphanumeric, and no spaces</p>}
            {!validationError && usernameAccepted && <button type="button"
                className="border border-white border-solid rounded-md p-1 text-[1.2rem] mt-4"
                onClick={navigateToChat}
                >
                Enter!</button>
            }
        </div>
    )
}
