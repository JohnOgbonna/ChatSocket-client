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
            <ChatContext.Provider value={{ ws: ws}}>
                <ChatComponent />
            </ChatContext.Provider>
        </>
    )

}
export default ChatPage;