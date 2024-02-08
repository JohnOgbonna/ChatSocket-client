import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import './App.css'
import HomePage from './pages/homePage/homePage'
import NotFoundPage from './pages/notFoundPage'
import ChatPage from './pages/chatPage/ChatPage'


const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage/>,
      errorElement: <NotFoundPage />
    },
    {
      path: '/chat/:username',
      element: <ChatPage/>
    }
  ])


  return(
    <RouterProvider router ={router}/>
  )

}
export default App