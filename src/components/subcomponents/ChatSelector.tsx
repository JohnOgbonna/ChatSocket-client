import { DisplayConvo, SocketMessage, clearTypingIndicator } from "../../functions_and_classes/messageFunctionsAndClasses"
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { requestConvoList } from "../../functions_and_classes/messageFunctionsAndClasses";
import { useParams, useSearchParams } from "react-router-dom";
import { updateQueryStringValueWithoutNavigation, deleteQueryStringValueWithoutNavigation } from "../../functions_and_classes/updateQueryStringValueWithoutNavigation";
import ChatSelectorSearch from "./ChatSelectorSearch";
import { chatSelectorSections } from "../../functions_and_classes/messageFunctionsAndClasses";
import useConversationList from "../../hooks/useConversationList";

interface Props {
    setConvo: React.Dispatch<React.SetStateAction<{
        chattingWith: string;
        convoID: string;
    } | undefined>>
    convo: { chattingWith: string, convoID: string } | undefined
}

export default function ChatSelector(props: Props) {
    const [searchParams] = useSearchParams()
    const params = useParams()
    const context = useContext(ChatContext)
    const [messages, updateMessages] = useState<DisplayConvo[] | undefined>(undefined)
    const [messageUpdate, setMessageUpdate] = useState<SocketMessage | undefined>(undefined)
    const ws: WebSocket | undefined = context?.ws
    const [section, setSection] = useState(searchParams.get('search') ? 'Search' : chatSelectorSections[0].name)
    const [conversationList] = useConversationList(messages as DisplayConvo[], messageUpdate as SocketMessage)

    useEffect(() => {
        if (ws && ws.readyState) {
            requestConvoList(ws, params.username)
        }
    }, [props])

    //listen for message of type display convo
    ws?.addEventListener('message', (message) => {
        const parsedMessage = JSON.parse(message.data)
        if (parsedMessage.type === 'displayConvo') {
            updateMessages((_prev) => parsedMessage.data)
        }
        else if (parsedMessage.type === 'socketReady') {
            requestConvoList(context?.ws as WebSocket, params.username)
        }
        else if (parsedMessage.type === 'incoming') {
            setMessageUpdate(parsedMessage)
        }
    });

    //update conversation being displayed in chat component using prop state updating function that updates state in parent: chatpage
    const setConvo = (convo: DisplayConvo) => {

        if (convo.speakingWith !== props.convo?.chattingWith) {
            const chatId = new URLSearchParams(window.location.search).get('chatId') as string
            const chattingWith = new URLSearchParams(window.location.search).get('chattingWith') as string
            clearTypingIndicator(ws as WebSocket, params.username as string, { convoId: chatId, chattingWith })
        }
        props.setConvo({
            convoID: convo.convoId,
            chattingWith: convo.speakingWith
        })
        updateQueryStringValueWithoutNavigation('chatId', convo.convoId)
        updateQueryStringValueWithoutNavigation('chattingWith', convo.speakingWith)
    }

    const onClickMode = (section: { name: string }) => {
        setSection(section.name)
        if (section.name === 'Search') {
            updateQueryStringValueWithoutNavigation('search', 'active')
        }
        else {
            deleteQueryStringValueWithoutNavigation(['search'])
        }
    }

    const animation = `duration-700 transition-all`
    const mobileStyles = props.convo?.chattingWith ? `sm:w-0 sm:max-w-0 sm:overflow-hidden` : `sm:w-full sm:max-w-500px`
    const commonContainerStyles = ``
    const defaultSelectorStyles = `flex flex-col mb-4 w-[30%] pt-4 ${commonContainerStyles} ${animation} ${mobileStyles}`
    const fullSelectorStyles = `w-full ${commonContainerStyles} ${animation} ${mobileStyles}`
    const defaultListStyles = `w-full text-left mb-2 border-b border-slate-600`
    const fullListStyles = `border-0 max-w-[600px]`

    return (
        <div className={`${defaultSelectorStyles} ${!props.convo?.chattingWith ? fullSelectorStyles : ''}`}>
            <ul className={`w-full flex justify-center ${animation}`}>
                {
                    chatSelectorSections.map((sectionChoice, index) => (
                        <li onClick={() => onClickMode(sectionChoice)} key={sectionChoice.name}
                            className={`block mb-2 ${index < 1 ? 'pr-4 border-r border-slate-600' : 'pl-4'} ${section === sectionChoice.name ? 'font-bold underline' : ''} `}>
                            {sectionChoice.name}</li>
                    ))
                }
            </ul>

            <ul className={`${section === 'Conversations' ? 'grid-flow-row mt-2' : 'max-w-0 overflow-hidden m-0 p-0 h-0'} ${animation}`}>
                {
                    //map messages to display and select to change convo using onclick function provided
                    conversationList && conversationList.length > 0 && conversationList.map(conversation => (
                        <li
                            onClick={() => setConvo(conversation)}
                            className={`${defaultListStyles} pb-2 ${!props.convo?.chattingWith ? fullListStyles : ''}`}
                            key={conversation.convoId}
                        >
                            <h3>{conversation.speakingWith}</h3>
                            <p className="text-[12px] line-clamp-1">{conversation.lastMessage}</p>
                        </li>
                    ))
                }
                {
                    messages && messages.length < 1 &&
                    <li className={`mt-[2rem]`}>No Conversations yet!</li>
                }
            </ul>

            <div className={`${section === 'Conversations' ? 'max-w-0 overflow-hidden m-0 p-0 h-0' : 'w-full max-w-[1200px]'} ${animation}`}>
                <ChatSelectorSearch setConvo={props.setConvo} convo={props.convo} />
            </div>
        </div>
    )
}