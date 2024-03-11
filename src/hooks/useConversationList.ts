import { useState, useEffect, useRef } from "react";
import { SocketMessage, DisplayConvo } from "../functions_and_classes/messageFunctionsAndClasses";


export default function useConversationList(convoList: DisplayConvo[] | undefined, newMessage: SocketMessage) {

   
    const [conversationList, setConversationList] = useState<DisplayConvo[] | undefined>(undefined)
    const prevNewMessage = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!conversationList && convoList) {
            //on initialization
            setConversationList(_prev => orderConversationsByTime(convoList))
        }
        if (newMessage && newMessage.id && newMessage.id !== prevNewMessage.current && conversationList) {
            //find display convo that matches senders username with speaking with 
            const convoIndex = conversationList?.findIndex(convo => convo.speakingWith === newMessage.username) || -1
            if (convoIndex > -1) {
                let updatedConversationList = [...conversationList];
                let conversation = updatedConversationList[convoIndex];

                // Update the conversation with the new message
                conversation.lastMessage = newMessage.message;
                conversation.lastMessageTime = newMessage.datetime;

                // Move the updated conversation to the end of the array
                updatedConversationList.splice(convoIndex, 1);
                updatedConversationList.unshift(conversation);

                // Update the state with the modified conversation list
                setConversationList(_prev=>updatedConversationList);
            }
            prevNewMessage.current = newMessage.id;
        }

    }, [convoList, newMessage])
    return [conversationList]
}

function orderConversationsByTime(convoList: DisplayConvo[]): DisplayConvo[] {
    // Sort the conversation list in descending order based on lastMessageTime
    convoList.sort((a, b) => {
        // Convert lastMessageTime to Date objects for comparison
        const timeA = new Date(a.lastMessageTime || '');
        const timeB = new Date(b.lastMessageTime || '');

        // Sort in descending order
        return timeB.getTime() - timeA.getTime();
    });

    return convoList;
}
