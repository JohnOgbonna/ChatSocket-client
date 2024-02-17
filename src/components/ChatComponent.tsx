import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/ChatContext";
import ChatSelector from "./subcomponents/ChatSelector";
import ChatSection from "./subcomponents/ChatSection";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSearchParams } from "react-router-dom";



export default function ChatComponent() {
    const [searchParams] = useSearchParams()
    const convoID = searchParams.get('chatId') as string

    //set convo details to use UR: parameters on init
    const urlConvo = convoID ? {
        chattingWith: searchParams.get('chattingWith') as string,
        convoID: searchParams.get('chatId') as string
    } : undefined

    const [convo, setConvo] = useState<{ chattingWith: string, convoID: string } | undefined>(convoID ? urlConvo : undefined)

    return (
        <div className="flex">
            {/* //set convo is used to change who is being chatted with, this provided when the connection is established, and conversation names are listed, the onclick function sets the state using set convo */}
            <ChatSelector setConvo={setConvo} convo = {convo}/>
            <ChatSection chattingWith={convo?.chattingWith} convoID={convo?.convoID} />
        </div>
    )
}