import { useParams } from "react-router-dom";
import { StoredMessage } from "../../functions_and_classes/messageFunctionsAndClasses";
import { formatTime } from "../../functions_and_classes/messageFunctionsAndClasses";
import { messageOptions, messageExtraInfo } from "../../functions_and_classes/messageFunctionsAndClasses";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

interface Props {
    message: StoredMessage
    convoId: string
}

interface PopupProps {
    message?: StoredMessage | undefined
    convoId: string
}


const OptionsPopup = (props: PopupProps) => {
    const context = useContext(ChatContext)
    const ws = context?.ws
    const params = useParams()
    const messageType = props.message?.from === params.username ? 'sent' : 'received'
    const bubbleAnimation = `duration-500 transition-all`
    const commonPopupStyles = `mb-5 max-h-[100px] ${bubbleAnimation}`
    const popupClassName = messageType === 'sent' ? ` text-right self-end ${commonPopupStyles}` : `text-left ${commonPopupStyles} self-start`

    const closedPopupClassName = `max-h-0 p-0 overflow-hidden ${bubbleAnimation}`

    return (
        <div className={props.message ? popupClassName : closedPopupClassName}>
            <ul>
                {
                    Object.keys(messageOptions).map(option => {
                        const optionObj = messageOptions[option]
                        const messageExtraInfo: messageExtraInfo = { username: params.username as string, convoId: props.convoId as string, ws: ws as WebSocket }

                        return (
                            <li className={`text-center mb-2 text-[12px]`} key={optionObj.name}
                                onClick={() => {
                                    if (!optionObj.functionNeedsConvoInfo) {
                                        optionObj.function(props.message as StoredMessage)
                                    }
                                    else {
                                        //initialize message extra info
                                        optionObj.function(props.message as StoredMessage, messageExtraInfo)
                                    }
                                }}
                            >{props.message ? optionObj.name : ''}</li>
                        )
                    }
                    )
                }
            </ul>
        </div>
    )
}
export default function ChatBubble(props: Props) {

    const [popup, setPopup] = useState<StoredMessage | undefined>(undefined)

    const params = useParams()
    const commonBubbleStyles = `${popup ? 'mb-2' : 'mb-6'} max-w-[65%] bg-cyan-600 rounded-t-lg px-2 py-1`
    //message type based on sent or received, same for message classname
    const messageType = props.message.from === params.username ? 'sent' : 'received'
    const messageClassName = messageType === 'sent' ? ` text-right self-end ${commonBubbleStyles}  rounded-bl-lg` : `text-left ${commonBubbleStyles} rounded-br-lg self-start`
    const messageId = messageType === 'sent' ? 'message-right' : 'message-left'

    return (
        <>
            <li id={messageId} className={`${messageClassName} `} onClick={() => setPopup(popup ? undefined : props.message)}>
                <p id='message' className=''>{props.message.message}</p>
                <span id='time-stamp' className='text-[11px] italic'>{formatTime(props.message.datetime as string)}</span>
            </li>
            {<OptionsPopup message={popup} convoId={props.convoId} />}
        </>
    )
}