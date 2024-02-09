import { createContext } from "react"

export const ChatContext = createContext<{ws: WebSocket} | undefined>(undefined) 

