import {Link, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFoundPage() {

    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(()=> navigate('/'), 1000)
    }, [navigate])

    return (
        <div>
            404 Not Found
            <Link to = "/">Rederecting to Home...</Link>
        </div>
    )
}