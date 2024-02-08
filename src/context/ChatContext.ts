import { createContext } from "react"

export const ChatContext = createContext<{ws: WebSocket, submitMessage: (e: React.FormEvent<HTMLFormElement>) => void} | undefined>(undefined)