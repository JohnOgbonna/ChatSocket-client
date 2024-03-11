// import './ChatPage.scss'
import '../pageStyles.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChatContext } from '../../context/ChatContext'
import ChatComponent from '../../components/ChatComponent'
import { NavBar } from '../../components/minicomponents/navBar'
import { Popup } from '../../components/minicomponents/popup'
import { messageNotification } from '../../functions_and_classes/messageFunctionsAndClasses'


const ChatPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    //initialize web socket 
    let ws = new WebSocket(`ws://localhost:3000?username=${params.username}`);
    console.log('runing')
    const prevUsername = useRef<string | undefined>(undefined);
    const [popupMessage, setPopupMessage] = useState('')

    useEffect(() => {
        // Initialize web socket 

        if (prevUsername.current && prevUsername.current !== params.username) {
            ws.close()
            ws = new WebSocket(`ws://localhost:3000?username=${params.username}`);
            return () => {
                ws.close();
                console.log('WebSocket connection closed');
            };
        }
        prevUsername.current = params.username

    }, [params.username]);

    ws.addEventListener('message', (message) => {
        const parsedMessage = JSON.parse(message.data)

        //redirect if user not registered
        if (parsedMessage.type === 'notRegistered') {
            setPopupMessage(parsedMessage.message)
            ws.close(4000, "Not registered")
            navigate('/')
        }
        if (parsedMessage.type === 'chatFull') {
            setPopupMessage(parsedMessage.message)
            ws.close(4000, "Chat full")
            navigate('/')
        }
        if (parsedMessage.type === 'invalidSession') {
            setPopupMessage(parsedMessage.message)
            ws.close(4000, "Invalid Session")
            navigate('/')
        }
        if (parsedMessage.type === 'incoming') {
            messageNotification(parsedMessage, setPopupMessage)
        }
    })
    ws.addEventListener('close', () => {
        console.log('Disconnected from server');
    });

    ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Cleanup function
    return (
        <div className={`relative`}>
            <NavBar ws={ws} />
            <div className={`pt-6`}>
                <ChatContext.Provider value={{ ws: ws }}>
                    <ChatComponent />
                </ChatContext.Provider>
            </div>
            <Popup message={popupMessage} />
        </div>
    )

}
export default ChatPage;