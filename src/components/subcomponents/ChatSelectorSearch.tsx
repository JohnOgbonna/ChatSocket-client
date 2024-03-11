import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { requestOnlineUserList, connectedUser, submitSearch, sendStartConvoRequest } from "../../functions_and_classes/messageFunctionsAndClasses";
import { useParams } from "react-router-dom";
import { updateQueryStringValueWithoutNavigation } from "../../functions_and_classes/updateQueryStringValueWithoutNavigation";


interface Props {
    setConvo: React.Dispatch<React.SetStateAction<{
        chattingWith: string;
        convoID: string;
    } | undefined>>
    convo: { chattingWith: string, convoID: string } | undefined
}


export default function ChatSelectorSearch(props: Props) {
    const context = useContext(ChatContext)
    const ws = context?.ws
    const params = useParams()
    const [onlineUsers, setOnlineUsers] = useState<connectedUser[] | undefined>(undefined)
    const [userSearchResults, setUserSearchResults] = useState<connectedUser[] | undefined>(undefined)

    useEffect(() => {
        if (ws?.readyState) {
            requestOnlineUserList(ws, params.username as string)
        }
    }, [])

    ws?.addEventListener('message', (message) => {

        const parsedMessage = JSON.parse(message.data)
        if (parsedMessage.type === 'onlineUserList') {
            setOnlineUsers(parsedMessage.data)
        }
        if (parsedMessage.type === 'userSearchResults') {
            console.log(userSearchResults)
            setUserSearchResults(_prev => parsedMessage.data)
        }
        if (parsedMessage.type === 'startConvoResponse') {
            //change props with response
            const { chatId, chattingWith } = parsedMessage
            props.setConvo({
                chattingWith: chattingWith,
                convoID: chatId
            })
            updateQueryStringValueWithoutNavigation('chatId', chatId)
            updateQueryStringValueWithoutNavigation('chattingWith', chattingWith)
        }
    })

    function searchUsers(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const target = e.currentTarget as HTMLFormElement;

        // Access the value of the search input
        const searchInputValue = target.searchInput.value;
        submitSearch(ws, params.username as string, searchInputValue)
    }

    return (
        <div>
            <form className={`flex items-center mt-3 w-full justify-center`} onSubmit={(e) => searchUsers(e)}>
                <input placeholder='Search for user' className={`mr-3 p-1 w-full max-w-[400px]`}
                    id='searchInput'
                />
                <button type='submit'>Search</button>
            </form>
            {
                userSearchResults && userSearchResults.length > 0 &&
                <div className={`my-8`}>
                    <p className={`underline mb-2`}>{`User Search Results:`}</p>
                    <ul className={`max-w-[400px]`}>
                        {
                            userSearchResults.map(user => (
                                <li className={`border-b border-slate-600 py-2 flex items-center text-center hover:underline`}
                                    key={user.id}
                                    onClick={() => sendStartConvoRequest(ws as globalThis.WebSocket, params.username as string, user.username)}
                                >
                                    {user.online && <div className={`rounded-[100%] bg-lime-600 mr-3 w-[1rem] h-[1rem]`}></div>}
                                    <p>{user.username}</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            }
            {
                (userSearchResults && userSearchResults.length < 1) &&
                <p className={`py-4`}>No Results for Search</p>
            }
            <p className={`my-3 underline`}>Online Users:</p>
            <ul className={`flex flex-col py-3 max-w-[400px] justify-center mx-auto`}>
                {
                    onlineUsers && onlineUsers.length > 0 && onlineUsers?.map(user => (
                        <li className={`border-b border-slate-600 pb-2 text-left flex items-center`}
                            key={`${user.id}-online`}
                        >
                            <div className={`rounded-[100%] bg-lime-600 mr-3 w-[1rem] h-[1rem]`}></div>
                            <p>{user.username}</p>
                        </li>
                    ))
                }
            </ul>
            {
                (onlineUsers && onlineUsers.length <= 0) &&
                <p>No Users Currently Online</p>
            }

        </div>
    )
}