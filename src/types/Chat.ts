import { Message } from "./Message";

export interface Chat {
    id: string;
    CreatedAt: string;
    messages: Message[];
}