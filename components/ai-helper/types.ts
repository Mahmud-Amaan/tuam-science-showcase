export type ChatRole = "user" | "bot" | "system"

export interface ChatMsg {
  role: ChatRole
  text: string
  time?: number
}

export interface Intent {
  type: "navigate" | "answer"
  target?: string
}

export interface QuickSuggestionConfig {
  label: string
  value: string
}
