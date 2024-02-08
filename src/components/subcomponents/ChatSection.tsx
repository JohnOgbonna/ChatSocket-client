import { useContext, useEffect, useState, useRef } from "react"
import { ChatContext } from "../../context/ChatContext"
import { useParams } from "react-router-dom"
import { SendChatHistory, StoredMessage, requestMessageHistory } from "../../functions_and_classes/messageFunctionsAndClasses"

interface Props {
    chattingWith: string | undefined,
    convoID: string | undefined
}

export default function ChatSection(props: Props) {
    const [messages, setMessages] = useState<StoredMessage[] | undefined>(undefined)
    const context = useContext(ChatContext)
    const params = useParams()

    const ws: WebSocket | undefined = context?.ws
    const submitMessage = context?.submitMessage

    useEffect(()=>{
        
        if (!messages && ws?.readyState){
            requestMessageHistory(ws, props.convoID, params.username)
        }
    }, [props])

    ws?.addEventListener('message', (message)=>{
        const parsedMessage: SendChatHistory = JSON.parse(message.data)
        if(parsedMessage.type === 'chatHistory'){
            setMessages(_prev=>parsedMessage.data)
        }
    })

    const renderCount = useRef(0);

    useEffect(() => {
      renderCount.current += 1;
    });
  

    return (
        
        <div className='text-[1rem] w-[60%] h-[70vh] flex flex-col justify-end px-4 border-l border-slate-600 ml-2 min-h[500px]'>
            {console.log(messages)}
                <div className='flex justify-center mb-4'>
                    <p className='mr-4 text-[1.2rem]'>{`Your Id: ${params.username}`}</p>
                </div>
                <ul id='message-container' className='flex flex-col h-full border-b border-slate-600 justify-end'>

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