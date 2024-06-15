import type { CurrentUser } from "./CurrentUser";

export interface UChat {
        chatId: string;
        receiverId: string;
        lastMessage: string;
        isSeen: boolean;
        updatedAt: number;
        receiverUser: CurrentUser | null;
}