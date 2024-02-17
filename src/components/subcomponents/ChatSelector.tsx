import { DisplayConvo } from "../../functions_and_classes/messageFunctionsAndClasses"
import { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { requestConvoList } from "../../functions_and_classes/messageFunctionsAndClasses";
import { useParams, useSearchParams } from "react-router-dom";
import { updateQueryStringValueWithoutNavigation } from "../../functions_and_classes/updateQueryStringValueWithoutNavigation";

interface Props {
    setConvo: React.Dispatch<React.SetStateAction<{
        chattingWith: string;
        convoID: string;
    } | undefined>>
    convo : {chattingWith : string, convoID: string} | undefined
}

export default function ChatSelector(props: Props) {
    const [_searchParams, setSearchParams] = useSearchParams()
    const params = useParams()
    const context = useContext(ChatContext)
    const [messages, updateMessages] = useState<DisplayConvo[]>([])
    const ws: WebSocket | undefined = context?.ws

    //listen for message of type display convo
    ws?.addEventListener('message', (message) => {
        const parsedMessage = JSON.parse(message.data)
        if (parsedMessage.type === 'displayConvo') {
            updateMessages((_prev) => parsedMessage.data)
        }
    });

    ws?.addEventListener('open', () => {
        requestConvoList(ws, params.username)
    });

    //update conversation being displayed in chat component using prop state updating function that updates state in parent: chatpage
    const setConvo = (convo: DisplayConvo) => {
        props.setConvo({
            convoID: convo.convoId,
            chattingWith: convo.speakingWith
        })
        updateQueryStringValueWithoutNavigation('chatId', convo.convoId)
        updateQueryStringValueWithoutNavigation('chattingWith', convo.speakingWith)
    }

    const animation = `duration-500 transition-all`
    const defaultSelectorStyles = `flex justify-center mb-4 w-[30%] pt-4 ${animation}`
    const fullSelectorStyles = `w-full ${animation}`
    const defaultListStyles = `w-full text-left mb-4 border-b border-slate-600`
    const fullListStyles = `border-0 max-w-[600px]`
    return (
        <div className={`${defaultSelectorStyles} ${!props.convo?.chattingWith ? fullSelectorStyles : ''}`}>
            <ul className="grid-flow-row w-full">
                {
                    //map messages to display and select to change convo using onclick function provided
                    messages.map(conversation => (
                        <li
                            onClick={() => setConvo(conversation)}
                            className={`${defaultListStyles} ${!props.convo?.chattingWith? fullListStyles : ''}`}
                            key={conversation.convoId}
                        >
                            <h3>{conversation.speakingWith}</h3>
                            <p className="text-[12px]">{conversation.lastMessage}</p>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}