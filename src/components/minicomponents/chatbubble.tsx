import { useParams } from "react-router-dom";
import { StoredMessage } from "../../functions_and_classes/messageFunctionsAndClasses";
import { formatTime } from "../../functions_and_classes/messageFunctionsAndClasses";
import { messageOptions,} from "../../functions_and_classes/messageFunctionsAndClasses";

interface Props {
    message: StoredMessage
}



const optionsPopup = () => {
    return (
        <ul>
            {
                Object.keys(messageOptions).map(option => {
                    const optionObj= messageOptions[option] 
                    return (
                        <li>{optionObj.name}</li>
                    )
                }
                )
            }
        </ul>
    )
}
export default function ChatBubble(props: Props) {
    const params = useParams()
    const commonBubbleStyles = 'mb-6 max-w-[65%] bg-cyan-600 rounded-t-lg px-2 py-1'
    //message type based on sent or received, same for message classname
    const messageType = props.message.from === params.username ? 'sent' : 'received'
    const messageClassName = messageType === 'sent' ? ` text-right self-end ${commonBubbleStyles}  rounded-bl-lg` : `text-left ${commonBubbleStyles} rounded-br-lg self-start`
    const messageId = messageType === 'sent' ? 'message-right' : 'message-left'

    return (
        <>
            <li id={messageId} className={`${messageClassName}`}>
                <p id='message' className=''>{props.message.message}</p>
                <span id='time-stamp' className='text-[11px] italic'>{formatTime(props.message.datetime)}</span>
            </li>
        </>
    )
}