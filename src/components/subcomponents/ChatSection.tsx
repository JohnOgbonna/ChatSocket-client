import { useContext, useEffect, useState, useRef, useMemo } from "react"
import { ChatContext } from "../../context/ChatContext"
import { useParams } from "react-router-dom"
import { SendChatHistory, SocketMessage, StoredMessage, requestMessageHistory, sendSocketMessage, confirmMessage } from "../../functions_and_classes/messageFunctionsAndClasses"
import { formatTime } from "../../functions_and_classes/messageFunctionsAndClasses"
import useMessageUpdate from "../../hooks/useMessageUpdate"

interface Props {
    chattingWith: string | undefined,
    convoID: string | undefined
}

export default function ChatSection(props: Props) {
    const [messages, setMessages] = useState<StoredMessage[] | undefined>(undefined)
    const context = useContext(ChatContext)
    const params = useParams()
    const ws: WebSocket | undefined = context?.ws
    const [latestMessage, setLatestMessage] = useState<StoredMessage | undefined>(undefined)
    const [showMessages] = useMessageUpdate(messages, latestMessage)

    useEffect(() => {
        if (ws?.readyState) {
            requestMessageHistory(ws, props.convoID, params.username)
            setLatestMessage(undefined)
        }
    }, [props])

    //event listener to receive message history
    ws?.addEventListener('message', (message) => {
        const parsedMessage: SendChatHistory | confirmMessage = JSON.parse(message.data)
        if (parsedMessage.type === 'chatHistory') {
            //set messages as chat history
            setMessages(parsedMessage.data)
        }
        if (parsedMessage.type === 'confirmMessage') {
            if (parsedMessage.id === latestMessage?.id) {
                //if ids match, and success:
                if (parsedMessage.success) {
                    setLatestMessage(undefined)
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

    }

    // type StoredMessage = {
    //     datetime: Date;
    //     id: string;
    //     to: string;
    //     from: string;
    //     enabled: [string, string];
    //     message: string;
    // }

    return (

        <div className='text-[1rem] w-[60%] h-[70vh] flex flex-col justify-end px-4 border-l border-slate-600 ml-2 min-h[500px]'>
            <div className='flex justify-center mb-4'>
                <p className='mr-4 text-[1.2rem]'>{`Your Id: ${params.username}`}</p>
            </div>
            <ul id='message-container' className='flex flex-col h-full border-b border-slate-600 justify-end overflow-y-scroll'>
                {
                    showMessages?.map(message => {
                        if (message.from === params.username) {
                            return (
                                <li id='message-right' className='mb-4 text-right self-end w-[65%]'>
                                    <p id='message' className=''>{message.message}</p>
                                    <span id='time-stamp' className='text-[11px]'>{formatTime(message.datetime)}</span>
                                </li>
                            )
                        }
                        else {

                            return (
                                <li id='message-left' className='mb-4 text-left w-[65%]'>
                                    <p id='message' className='w-[55%]'>{message.message}</p>
                                    <span id='time-stamp' className='text-[11px]'>{formatTime(message.datetime)}</span>
                                </li>
                            )

                        }
                    })
                }

                <li id='message-left' className='mb-4 text-left w-[65%]'>
                    <p id='message' className='w-[55%]'>Whats good</p>
                    <span id='time-stamp' className='text-[11px]'>24 Jan 10:50</span>
                </li>
                <li id='message-right' className='mb-4 text-right self-end w-[65%]'>
                    <p id='message' className=''>Whats good hope all is well and everthing is good</p>
                    <span id='time-stamp' className='text-[11px]'>24 Jan 10:51</span>
                </li>
            </ul>
            <p id='feedback' className='text-[12px] pt-2'>Someone is typing a message</p>
            <form className='w-[100%] flex my-2' id="message-form" onSubmit={submitMessage}>
                <input type='text' name='message' id='messageInput' className='w-full px-2 mr-4 h-[2rem] border rounded-sm' />
                <button type='submit' id='send-button' className='border rounded-md px-2'>send <span><i className='fas fa-paper-plane'></i></span> </button>
            </form>

        </div>
    )
}