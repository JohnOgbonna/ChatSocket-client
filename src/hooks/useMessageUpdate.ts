import { useEffect, useState } from "react";
import { StoredMessage } from "../functions_and_classes/messageFunctionsAndClasses";

//purpose of this hook is to return an array of stored messages to map, and dynamically update the messages
export default function useMessageUpdate(messages: StoredMessage[] | undefined, latestMessage: StoredMessage | undefined) {

    const [showMessages, setShowMessages] = useState<StoredMessage[] | undefined>(messages)

    useEffect(() => {
        //check if messages and latest message exist
        if (latestMessage) {
            //check if latest message is already in the stored messages
            const findLatestMessage = messages?.find(message => message.id === latestMessage.id)
            //if message doesnt exist, add message
            if (!findLatestMessage) {
                setShowMessages(_prev => [...showMessages || [], latestMessage])
            }
            if (latestMessage.failed) {
                //if latest message failed, set show messages at failed index and update it to be failed in chat history
                const index = showMessages?.findIndex(message => message.id === latestMessage.id)
                if (index && index >= 0) {
                    //use placeholder to set state
                    const showMessagesPlaceholder = showMessages
                    if (showMessagesPlaceholder) {
                        showMessagesPlaceholder[index] = latestMessage
                    }
                }
            }
        }
        else {
            setShowMessages(messages)
        }

    }, [messages, latestMessage])
    return [showMessages]

}