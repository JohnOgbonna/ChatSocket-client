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
                setShowMessages(prev => [...prev || [], latestMessage])
            }
            if (latestMessage.failed) {
                //if latest message failed, set show messages at failed index and update it to be failed in chat history
                const index = showMessages?.findIndex(message => message.id === latestMessage.id)
                if (index && index >= 0) {
                    //use placeholder to set state
                    const showMessagesPlaceholder = showMessages
                    //set the index of message to be failed === true, so it can be accessed in the ui and options can be taken
                    if (showMessagesPlaceholder) {
                        showMessagesPlaceholder[index] = latestMessage
                    }
                    setShowMessages(_prev=>showMessagesPlaceholder)
                }
            }
            if (latestMessage.active) {
                //if latest message succeded, set show messages at succeeded index and update it to be finalized in chat history
                const index = showMessages?.findIndex(message => message.id === latestMessage.id)
                if (index && index >= 0) {
                    //use placeholder to set state
                    const showMessagesPlaceholder = showMessages
                    //set the index of message to be active === true, so it can be accessed in the ui
                    if (showMessagesPlaceholder) {
                        showMessagesPlaceholder[index] = latestMessage
                    }
                    setShowMessages(_prev=>showMessagesPlaceholder)
                }
            }
            if(latestMessage.recipient){
                // add message right away if received message
                setShowMessages(prev=>[...prev || [], latestMessage])
            }
        }
        else {
            setShowMessages(messages)
        }

    }, [messages, latestMessage])
    return [showMessages]

}