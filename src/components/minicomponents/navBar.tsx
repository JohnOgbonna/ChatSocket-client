import { useParams, useNavigate } from "react-router-dom";
import { sendLogoutRequest } from "../../functions_and_classes/userFunctionsAndClasses";
import { logout } from "../../functions_and_classes/userFunctionsAndClasses";

interface Props {
    ws: WebSocket
}

export function NavBar(props: Props) {
    const params = useParams()
    const navigate = useNavigate()

    function Logout() {
        logout(props.ws, params.username as string)
        navigate(`/`)
    }

    return (
        <div className={`flex justify-between pb-2 border-b border-slate-600`}>
            <h2>{params.username}</h2>
            <p onClick={Logout}>Logout</p>
        </div>
    )
}