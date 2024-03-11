import { v4 as uuidv4 } from 'uuid';

export class SocketMessage {
    id: string;
    type: string;
    username: string | undefined;
    recipient: string | undefined
    message: string;
    datetime: Date;
    constructor(id: string, type: string, message: string, username: string | undefined, recipient: string | undefined, datetime: Date) {
        this.id = id,
            this.type = type,
            this.username = username,
            this.recipient = recipient
        this.message = message,
            this.datetime = datetime,
            this.username = username
    }
}

export const sendSocketMessage = (ws: WebSocket, message: string, type: string, username: string | undefined, recipient: string | undefined) => {
    const socketmessage: SocketMessage | undefined = new SocketMessage(
        uuidv4(),
        type,
        message,
        username,
        recipient,
        new Date(),
    )
    ws.send(JSON.stringify(socketmessage))
    const storedMessage: StoredMessage | undefined = new StoredMessage(socketmessage.datetime, socketmessage.id, recipient, username, [username, recipient], message)
    storedMessage.active = false
    return (storedMessage)
}

export class DisplayConvo {
    speakingWith: string;
    lastMessage: string;
    convoId: string;
    lastMessageTime?: string | Date
    constructor(speakingWith: string, lastMessage: string, convoId: string) {
        this.speakingWith = speakingWith,
            this.lastMessage = lastMessage,
            this.convoId = convoId
    }
}

export class ConvoListReq {
    type: 'convoListReq';
    username: string | undefined;
    constructor(username: string | undefined) {
        this.type = 'convoListReq',
            this.username = username
    }
}

export function requestConvoList(ws: WebSocket, username: string | undefined) {
    const convoRequest = new ConvoListReq(username)
    ws.send(JSON.stringify(convoRequest))
}

export class messageHistoryReq {
    type: 'messageHistoryReq';
    username: string | undefined;
    convoId: string | undefined;
    constructor(username: string | undefined, convoId: string | undefined) {
        this.type = 'messageHistoryReq',
            this.username = username,
            this.convoId = convoId
    }
}

export function requestMessageHistory(ws: WebSocket | undefined, convoId: string | undefined, username: string | undefined) {
    const reqMessageHistory = new messageHistoryReq(username, convoId)
    try {
        ws?.send(JSON.stringify(reqMessageHistory))
    }
    catch (err) {
        console.log(err)
    }
}

export class StoredMessage {
    datetime: Date | string;
    id: string;
    to: string | undefined;
    from: string | undefined;
    enabled: [string | undefined, string | undefined];
    message: string;
    active?: boolean | undefined;
    failed?: boolean;
    incoming?: boolean
    constructor(datetime: Date, id: string, to: string | undefined, from: string | undefined, enabled: [string | undefined, string | undefined], message: string) {
        this.datetime = datetime
        this.id = id,
            this.from = from,
            this.to = to,
            this.enabled = enabled,
            this.message = message
    }
}

export function receiveMessage(socketMessage: SocketMessage) {
    //socketmessage.username == he who sent the message, socketmessage.recipient === he who receives, he who is logged in
    //this function returns a stored message given a socket message
    let receivedMessage = new StoredMessage(
        socketMessage.datetime,
        socketMessage.id,
        socketMessage.recipient,
        socketMessage.username,
        [socketMessage.username, socketMessage.recipient],
        socketMessage.message
    )
    receivedMessage.incoming = true
    return receivedMessage
}

export type SendChatHistory = {
    type: 'chatHistory';
    data: StoredMessage[] | undefined;
    convoId: string
}

export function formatTime(timeStr: string | Date): string {
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const time: Date = new Date(timeStr);
    const hours: number = time.getHours();
    const minutes: number = time.getMinutes();
    const day: number = time.getDate();
    const month: number = time.getMonth();
    const formattedTime: string = `${day} ${months[month]} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedTime;
}

export type confirmMessage = {
    type: 'confirmMessage',
    id: string | undefined,
    username: string | undefined,
    success: boolean
}

export class deleteRequest {
    type: 'deleteRequest';
    username: string;
    messageId: string;
    convoId: string;
    constructor(username: string, messageId: string, convoId: string) {
        this.type = 'deleteRequest',
            this.username = username,
            this.messageId = messageId,
            this.convoId = convoId
    }
}

export function sendDeleteRequest(info: messageExtraInfo, message: StoredMessage) {
    const DeleteRequest = new deleteRequest(info.username, message.id, info.convoId)
    info.ws.send(JSON.stringify(DeleteRequest))
}

export type messageExtraInfo = { username: string, convoId: string, ws: WebSocket }

//functions and options for message pop ups

type MessageAction = {
    name: string;
    functionNeedsConvoInfo: boolean;
    // Define the function signature based on the parameters used in the object
    // This represents a function that takes a StoredMessage and optional messageExtraInfo
    function: (message: StoredMessage, convoInfo?: messageExtraInfo) => void;
};

type MessageOptions = {
    [key: string]: MessageAction;
};

export const messageOptions: MessageOptions = {
    copy: {
        name: 'Copy Message',
        functionNeedsConvoInfo: false,
        function: function (message: StoredMessage) {
            navigator.clipboard.writeText(message.message).then(() => {
                alert('Text Copied')
            }).catch(_err => alert('Could not copy text!'))
        }
    },
    delete: {
        name: 'Delete',
        functionNeedsConvoInfo: true,
        function: function (message: StoredMessage, convoInfo?: messageExtraInfo) {
            console.log(convoInfo)
            sendDeleteRequest(convoInfo as messageExtraInfo, message)
        }
    },
}

class onlineUserListRequest {
    ws: WebSocket;
    username: string;
    type: 'onlineUserListRequest';
    constructor(ws: WebSocket, username: string) {
        this.ws = ws,
            this.username = username
        this.type = 'onlineUserListRequest';
    }
}

export const requestOnlineUserList = (ws: WebSocket, username: string) => {
    const userListRequest = new onlineUserListRequest(ws, username)
    if (ws.readyState) {
        ws.send(JSON.stringify(userListRequest))
    }
}

export type connectedUser = {
    id: string
    username: string;
    ws?: WebSocket[];
    dateJoined: Date
    online?: boolean
}

export type onlineUserListResponse = {
    type: 'onlineUserList'
    data: connectedUser[]
}

export const chatSelectorSections = [
    {
        name: 'Conversations'
    },
    {
        name: 'Search'
    }
]

export class SearchUserRequest {
    type: 'searchUserRequest';
    username: string;
    searchkey: string;
    constructor(username: string, searchkey: string) {
        this.type = 'searchUserRequest',
            this.username = username,
            this.searchkey = searchkey
    }

}

export const submitSearch = (ws: globalThis.WebSocket | undefined, username: string, searchKey: string) => {
    //construct new submit search request
    const searchUserRequest = new SearchUserRequest(username, searchKey)
    //send with ws
    if (ws && ws.readyState) {
        ws.send(JSON.stringify(searchUserRequest))
    }
}

export type searchUserResponse = {
    type: 'userSearchResults',
    data: connectedUser[]
};

export class startConvoRequest {
    type: 'startConvoReq'
    username: string
    chattingWith: string

    constructor(username: string, chattingWith: string) {
        this.type = 'startConvoReq',
            this.username = username,
            this.chattingWith = chattingWith
    }
}

export function sendStartConvoRequest(ws: WebSocket | globalThis.WebSocket, username: string, chattingWith: string) {
    const request = new startConvoRequest(username, chattingWith)
    ws.send(JSON.stringify(request))
}

export type startConvoRes = {
    type: 'startConvoResponse'
    chatId: string
    chattingWith: string
}

export class sendTypingIndicator {
    type: 'typingIndicator'
    username: string
    chattingWith: string
    convoId: string
    typing: boolean
    constructor(username: string, chattingWith: string, convoId: string, typing: boolean) {
        this.type = 'typingIndicator'
        this.chattingWith = chattingWith
        this.username = username
        this.convoId = convoId
        this.typing = typing
    }
}

export type currentlyTyping = {
    conversantTyping: boolean;
    currentlyTyping: boolean;
}

export function onMessageInputChange(e: React.FormEvent<HTMLInputElement>, ws: WebSocket, typing: currentlyTyping, setTyping: React.Dispatch<React.SetStateAction<currentlyTyping>>, convoInfo: { convoId: string, chattingWith: string }, username: string) {
    const input = e.currentTarget as HTMLInputElement; // Cast to HTMLFormElement

    let typingIndicator: sendTypingIndicator
    if (input.value) {
        //send typing indicator
        typingIndicator = new sendTypingIndicator(username, convoInfo.chattingWith, convoInfo.convoId, true)
        if (!typing.currentlyTyping) {
            setTyping({ ...typing, currentlyTyping: true })
        }
    }
    else {
        //if field is empty, not typing
        typingIndicator = new sendTypingIndicator(username, convoInfo.chattingWith, convoInfo.convoId, false)
        if (typing.currentlyTyping) {
            setTyping({ ...typing, currentlyTyping: false })
        }
    }
    ws.send(JSON.stringify(typingIndicator))

}

export type typingIndicatorRes = {
    type: 'typingIndicatorRes'
    convoId: string
    typing: boolean
}

export function handleTypingIndicator(messengerTyping: boolean, setMessengerTyping: React.Dispatch<React.SetStateAction<boolean>>, typingIndicatorRes: typingIndicatorRes) {
    const { typing, convoId: indicatorConvoId } = typingIndicatorRes
    const currentSearchParams = new URLSearchParams(window.location.search)
    //if typing indicator message and front end status are not aligned and user is in the right chat..
    if ((typing !== messengerTyping) && (indicatorConvoId === currentSearchParams.get('chatId'))) {
        setMessengerTyping(typing)
    }
}

export function messageNotification(message: SocketMessage, setPopupMessage: React.Dispatch<React.SetStateAction<string>>,) {
    const currentSearchParams = new URLSearchParams(window.location.search)
    if (currentSearchParams.get('chattingWith') && currentSearchParams.get('chattingWith') !== message.username) {
        const notificationMessage = `${message.username} sent a message: ${message.message}`
        setPopupMessage(_prevMessage => notificationMessage)
    }
}

export function clearTypingIndicator(ws: globalThis.WebSocket, username: string, convoInfo: { convoId: string, chattingWith: string }) {
    const typingIndicator = new sendTypingIndicator(username, convoInfo.chattingWith, convoInfo.convoId, false)
    if (ws && ws.readyState) {
        ws.send(JSON.stringify(typingIndicator))
    }
}