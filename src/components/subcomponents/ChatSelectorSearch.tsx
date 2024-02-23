import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { requestOnlineUserList, connectedUser, onlineUserListResponse } from "../../functions_and_classes/messageFunctionsAndClasses";
import { useParams } from "react-router-dom";

interface Props {
    setConvo: React.Dispatch<React.SetStateAction<{
        chattingWith: string;
        convoID: string;
    } | undefined>>
    convo: { chattingWith: string, convoID: string } | undefined
}



const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

}


export default function ChatSelectorSearch(props: Props) {
    const context = useContext(ChatContext)
    const ws = context?.ws
    const params = useParams()
    const [onlineUsers, setOnlineUsers] = useState<connectedUser[] | undefined>(undefined)

    useEffect(() => {
        if (ws?.readyState) {
            requestOnlineUserList(ws, params.username as string)
        }
    }, [context?.ws])

    ws?.addEventListener('message', (message) => {
        const parsedMessage: onlineUserListResponse = JSON.parse(message.data)
        if (parsedMessage.type === 'onlineUserList') {
            setOnlineUsers(parsedMessage.data)
        }
    })

    return (
        <div>
            <form className={`flex items-center mt-3 w-full justify-center`}>
                <input placeholder='Search for user' className={`mr-3 p-1 w-full max-w-[400px]`} />
                <button type='submit'>Search</button>
            </form>
            <p className={`my-3 underline`}>Online Users:</p>
            <ul className={`flex flex-col py-3 max-w-[400px] justify-center mx-auto`}>
                {
                    onlineUsers && onlineUsers.length > 0 && onlineUsers?.map(user => (
                        <li className={`border-b border-slate-600 pb-2 text-left flex items-center`}>
                            <div className={`rounded-[100%] bg-lime-600 mr-3 w-[1rem] h-[1rem]`}></div>
                            <p>{user.username}</p>
                        </li>
                    ))
                }
            </ul>
            {
                (!onlineUsers || onlineUsers.length <= 0) &&
                <p>No Users Currently Online</p>
            }
        </div>
    )
}