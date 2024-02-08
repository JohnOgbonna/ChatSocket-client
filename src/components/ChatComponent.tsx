import { useContext, useState } from "react"
import { ChatContext } from "../context/ChatContext";
import ChatSelector from "./subcomponents/ChatSelector";
import ChatSection from "./subcomponents/ChatSection";


export default function ChatComponent() {
    const [convo, setConvo] = useState<{chattingWith : string, convoID: string} | undefined>(undefined)
    return (
        <div className="flex">
            <ChatSelector setConvo = {setConvo}/>
            <ChatSection chattingWith={convo?.chattingWith} convoID={convo?.convoID}/>
        </div>
    )
}