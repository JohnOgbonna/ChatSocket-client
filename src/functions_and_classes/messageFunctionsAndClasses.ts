import { v4 as uuidv4 } from 'uuid';


export class SocketMessage {
    id: string;
    type: string;
    username: string | undefined;
    recipient: string
    message: string;
    datetime: Date;
    constructor(id: string, type: string, message: string, username: string | undefined, recipient: string, datetime: Date) {
        this.id = id,
            this.type = type,
            this.username = username,
            this.recipient = recipient
        this.message = message,
            this.datetime = datetime,
            this.username = username
    }
}

export const sendSocketMessage = (ws: WebSocket, message: string, type: string, username: string | undefined, recipient: string) => {
    ws.send(JSON.stringify(new SocketMessage(
        uuidv4(),
        type,
        message,
        username,
        recipient,
        new Date(),
    )))
}
export class DisplayConvo {
    speakingWith: string;
    lastMessage: string;
    convoId: string;
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
    ws?.send(JSON.stringify(reqMessageHistory))
    
}
export type StoredMessage ={
    datetime: Date;
    id: string;
    to: string;
    from: string;
    enabled: [string, string];
    message: string;
}

export type SendChatHistory = {
    type: 'chatHistory';
    data: StoredMessage[];
    convoId: string
}

export function formatTime(timeStr: string): string {
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const time: Date = new Date(timeStr);
    const hours: number = time.getHours();
    const minutes: number = time.getMinutes();
    const day: number = time.getDate();
    const month: number = time.getMonth();
  
    const formattedTime: string = `${day} ${months[month]} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  
    return formattedTime;
  }