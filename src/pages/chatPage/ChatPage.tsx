// import './ChatPage.scss'
import '../pageStyles.css'
import { useEffect, createContext } from 'react'
import { useParams } from 'react-router-dom'
import { SocketMessage, sendSocketMessage, requestConvoList } from '../../functions_and_classes/messageFunctionsAndClasses'
import { ChatContext } from '../../context/ChatContext'
import ChatSelector from '../../components/subcomponents/ChatSelector'
import ChatComponent from '../../components/ChatComponent'


const ChatPage = () => {
    const params = useParams()
    //initialize web socket 
    const ws = new WebSocket(`ws://localhost:3000?username=${params.username}`);

    //send message function to be contextualized
    const submitMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement; // Cast to HTMLFormElement
        const messageInput = form.messageInput.value;
        if (ws && messageInput) {
            sendSocketMessage(ws, messageInput, 'direct', params.username, 'bill')
        }
    }
    

    ws.addEventListener('open', () => {
        console.log('Connected to server');
    });

    ws.addEventListener('close', () => {
        console.log('Disconnected from server');
    });

    return (
        <>
            <h2 className='text-[1.5rem] mb-8'>Welcome to Chat Socket!</h2>
            {console.log('hi')}
            <ChatContext.Provider value={{ ws: ws, submitMessage: submitMessage }}>
                <ChatComponent />
            </ChatContext.Provider>
        </>
    )

}
export default ChatPage;