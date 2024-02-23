import { useContext, useEffect, useState, useRef, useMemo } from "react"
import { ChatContext } from "../../context/ChatContext"
import { useParams, useSearchParams } from "react-router-dom"
import { SendChatHistory, SocketMessage, StoredMessage, requestMessageHistory, sendSocketMessage, confirmMessage, receiveMessage } from "../../functions_and_classes/messageFunctionsAndClasses"
import useMessageUpdate from "../../hooks/useMessageUpdate"
import ChatBubble from "../minicomponents/chatbubble"
import { parse } from "dotenv"
import back_icon from '../../assets/icons/back_icon.svg'
import { deleteQueryStringValueWithoutNavigation } from "../../functions_and_classes/updateQueryStringValueWithoutNavigation"

interface Props {
    setConvo: React.Dispatch<React.SetStateAction<{
        chattingWith: string;
        convoID: string;
    } | undefined>>
    chattingWith: string | undefined,
    convoID: string | undefined
}

export default function ChatSection(props: Props) {
    const [messages, setMessages] = useState<StoredMessage[] | undefined>(undefined)
    const context = useContext(ChatContext)
    const params = useParams()
    const ws: WebSocket | undefined = context?.ws
    const [latestMessage, setLatestMessage] = useState<StoredMessage | undefined>(undefined)
    const [deleteMessage, setDeleteMessage] = useState<string | undefined>(undefined)
    const [showMessages] = useMessageUpdate(messages, latestMessage, deleteMessage)
    const prevProps = useRef<string | undefined>(undefined)

    ws?.addEventListener('open', () => {
        requestMessageHistory(ws, props.convoID, params.username)
    });

    useEffect(() => {
        //only request list of convo if props change and prevProps initialized

        if ((ws?.readyState && prevProps.current !== props.chattingWith) && props.chattingWith) {
            requestMessageHistory(ws, props.convoID, params.username)
            setLatestMessage(undefined)
        }
        prevProps.current = props.chattingWith;
    }, [props])


    //event listener to receive message history
    ws?.addEventListener('message', (message) => {
        const parsedMessage: any = JSON.parse(message.data)
        if (parsedMessage.type === 'chatHistory') {
            //set messages as chat history
            setMessages(_prev => parsedMessage.data)

        }

        else if (parsedMessage.type === 'confirmMessage') {
            if (parsedMessage.id === latestMessage?.id) {
                //if ids match, and success:
                if (parsedMessage.success) {
                    const succeedLatestMessage = latestMessage || null
                    if (succeedLatestMessage) {
                        succeedLatestMessage.active = true
                        setLatestMessage(succeedLatestMessage)
                    }
                }
                else {
                    //set failed message, if failed latest message possibly inaccessable
                    const failedLatestMessage = latestMessage || null
                    if (failedLatestMessage) {
                        failedLatestMessage.failed = true
                        setLatestMessage(failedLatestMessage)
                    }
                }
            }
        }

        else if (parsedMessage.type === 'deleteConfirmation') {
            setDeleteMessage(parsedMessage.messageId)
        }
    })

    //separate event listener for incoming message
    ws?.addEventListener('message', (message) => {
        const parsedMessage: SocketMessage = JSON.parse(message.data)

        if (parsedMessage.type === 'incoming' && parsedMessage.username === props.chattingWith) {
            //transform socketMessage to storedMessage
            const newMessage: StoredMessage = receiveMessage(parsedMessage)
            setLatestMessage(newMessage)
        }
    })

    const submitMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement; // Cast to HTMLFormElement
        const messageInput = form.messageInput.value;
        if (ws && messageInput) {
            //new message sent, and call function to send message
            const newMessage: StoredMessage | undefined = sendSocketMessage(ws, messageInput, 'direct', params.username, props.chattingWith)
            setLatestMessage(_prev => newMessage)
        }
        form.reset()
        const messageContainer = document.getElementById('message-container') as HTMLElement
        messageContainer.scrollTop = 100000
    }
    const removeChat = () =>{
        props.setConvo(undefined)
        deleteQueryStringValueWithoutNavigation(['chatId', 'chattingWith'])
    }

    const mobileStyles = props.chattingWith ? `sm:max-w-full sm:w-full sm:border-none px-1 h-[85vh]` : `sm:max-w-0 sm:w-0 overflow-hidden m-0 p-0`
    const animation = `duration-500 transition-all`
    const chatSectionDefaultStyle = `text-[1rem] w-[60%] h-[70vh] flex flex-col justify-end px-2 border-l border-slate-600 ml-2 min-h[500px] ${animation} ${mobileStyles}`
    const chatSectionClosedStyle = `max-w-[30%] overflow-hidden px-0 mx-0 border-0 border-l-0 ${animation} ${mobileStyles}`

    return (
        props.chattingWith ?
            <div className={`${chatSectionDefaultStyle} ${!props.chattingWith ? chatSectionClosedStyle : ''}`}>
                <div className='flex justify-center mb-4'>
                    <img src={back_icon} className='w-[32px] self-start mr-4' onClick={()=>removeChat()}/>
                    <p className='mr-4 text-[1.2rem]'>{`Chatting With: ${props.chattingWith}`}</p>
                </div>
                <ul id='message-container' className='flex flex-col  border-b border-slate-600 overflow-y-scroll'>
                    {
                        showMessages?.map(message => (
                            <ChatBubble message={message} convoId={props.convoID as string} key={message.id} />
                        ))
                    }
                </ul>
                <p id='feedback' className='text-[12px] pt-2'>Someone is typing a message</p>
                <form className='w-[100%] flex my-2' id="message-form" onSubmit={submitMessage}>
                    <input type='text' name='message' id='messageInput' className='w-full px-2 mr-4 h-[2rem] border rounded-sm' />
                    <button type='submit' id='send-button' className='border rounded-md px-2'>send <span><i className='fas fa-paper-plane'></i></span> </button>
                </form>

            </div>
            :
            <div className={`w-[50%] flex flex-col justify-center h-[70vh] ${mobileStyles} ${animation}`}>
                <p>No Chat Selected</p>
            </div>
    )
}