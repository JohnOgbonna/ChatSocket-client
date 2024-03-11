import { useState, useMemo, useEffect } from "react"
import '../pageStyles.css'
import './homeStyles.css'
import { useNavigate } from "react-router-dom"
import { login, inputs, fields, handleFieldChange } from "../../functions_and_classes/userFunctionsAndClasses"

const modeOptions = ['Register', 'Login']

export default function HomePage() {

    const navigate = useNavigate()
    const [mode, setMode] = useState<'Register' | 'Login'>('Login')
    const [credentialsAccepted, acceptCredentials] = useState<boolean>(false)
    const [fields, setFields] = useState<fields>({
        username: '',
        password: ''
    })

    const validationError = useMemo(() => {
        const regex = /^[a-zA-Z0-9]+$/;
        let username: boolean
        let password: boolean

        if (fields.username.length >= 4 && !fields.username.includes(' ') && regex.test(fields.username)) {
            username = false
        } else {
            username = true
        }
        if (fields.password.length >= 4 && !fields.password.includes(' ')) {
            password = false
        } else {
            password = true
        }
        //if there is an error in the field, the key reads as 'field':true if no error: 'field': false
        return ({
            username: username,
            password: password
        })

    }, [fields]);

    useEffect(() => {
        if (credentialsAccepted) {
            if (mode === 'Login') {
                navigate(`/chat/${fields.username}`)
            }
            else setMode(_prev => 'Login')
        }
    }, [credentialsAccepted])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await login(e, mode, validationError, acceptCredentials)

        if (mode === 'Login' && credentialsAccepted) {
            navigate(`/chat/${fields.username}`)
        }
    }


    return (
        <div>
            <h2 className={`text-[1.5rem] mb-4`}>Welcome!</h2>
            <p className={`mt-3`}>Login or Register to Get Started!</p>
            <ul className={`flex justify-center`}>
                {
                    modeOptions.map((modeOption, index) => (
                        <li className={`text-[1.2rem] pr-4 mt-4 border-r border-slate-600 last:pr-0 last:border-r-0 last: pl-4 ${modeOption === mode ? 'font-bold underline' : ''}`}
                            key={`${mode}-${index}`}
                            onClick={() => setMode(modeOption as 'Register' | 'Login')}
                        >
                            {modeOption}
                        </li>
                    ))
                }
            </ul>
            {credentialsAccepted && mode === 'Login' && <p className={`text-red-700`}>Successfully Registered, Login Now!</p>}
            <form className="flex flex-col items-center mt-8 text-[1.2rem] mb-4"
                onSubmit={(e) => handleSubmit(e)}
            >
                {
                    Object.keys(inputs).map(input => {
                        const field = inputs[input]
                        return (
                            <div key={`${field.id}-input`}>
                                <input
                                    type="text" className="w-full px-2 h-[1.8rem] max-w-[400px] text-[1rem] "
                                    id={field.id}
                                    onChange={(e) => {
                                        handleFieldChange(e, field.id as "username" | "password", fields, setFields)
                                        if(credentialsAccepted){
                                            acceptCredentials(false)
                                        }
                                    }}
                                />
                                <label htmlFor={field.id}
                                    className={`text-[1rem] mb-4 `}
                                >
                                    {field.name}
                                </label>
                            </div>
                        )
                    })
                }
                {mode === 'Register' && validationError.username && <p className="text-red-600 mt-4 sm:text-[1rem]">Username must be 4 or more characters, alphanumeric, and no spaces</p>}
                {mode === 'Register' && validationError.password && <p className="text-red-600 mt-4 sm:text-[1rem]">Password must be 4 or more characters, and no spaces</p>}


                {/* // Show button when no validation error and registering or when mode is login and credentials not yet accepted */}
                {((!validationError.username && !validationError.password && mode === 'Register') || mode === 'Login') && <button type="submit"
                    className="border border-white border-solid rounded-md p-1 text-[1.2rem] mt-4"
                >
                    {mode}</button>
                }

            </form>
        </div>
    )
}
