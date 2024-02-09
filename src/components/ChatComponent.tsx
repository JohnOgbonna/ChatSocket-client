import { useContext, useState } from "react"
import { ChatContext } from "../context/ChatContext";
import ChatSelector from "./subcomponents/ChatSelector";
import ChatSection from "./subcomponents/ChatSection";


export default function ChatComponent() {
    const [convo, setConvo] = useState<{ chattingWith: string, convoID: string } | undefined>(undefined)
    return (
        <div className="flex">
            {/* //set convo is used to change who is being chatted with, this provided when the connection is established, and conversation names are listed, the onclick function sets the state using set convo */}
            <ChatSelector setConvo={setConvo} />
            <ChatSection chattingWith={convo?.chattingWith} convoID={convo?.convoID} />
        </div>
    )
}