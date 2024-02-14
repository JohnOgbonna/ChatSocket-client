// import './ChatPage.scss'
import '../pageStyles.css'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { SocketMessage, sendSocketMessage, requestConvoList } from '../../functions_and_classes/messageFunctionsAndClasses'
import { ChatContext } from '../../context/ChatContext'
import ChatSelector from '../../components/subcomponents/ChatSelector'
import ChatComponent from '../../components/ChatComponent'


const ChatPage = () => {
    const params = useParams()
    //initialize web socket 
    let ws = new WebSocket(`ws://localhost:3000?username=${params.username}`);
    console.log('runing')
    const prevUsername = useRef<string | undefined>(undefined);

    useEffect(() => {
        // Initialize web socket 

        if (prevUsername.current && prevUsername.current !== params.username ) {
            ws.close()
            ws = new WebSocket(`ws://localhost:3000?username=${params.username}`);
            ws.addEventListener('close', () => {
                console.log('Disconnected from server');
            });

            ws.addEventListener('error', (error) => {
                console.error('WebSocket error:', error);
            });
            prevUsername.current = params.username
            // Cleanup function
            return () => {
                ws.close();
                console.log('WebSocket connection closed');
            };
        }

    }, [params.username]);

    return (
        <>
            <h2 className='text-[1.5rem] mb-8'>Welcome to Chat Socket!</h2>
            <ChatContext.Provider value={{ ws: ws }}>
                <ChatComponent />
            </ChatContext.Provider>
        </>
    )

}
export default ChatPage;