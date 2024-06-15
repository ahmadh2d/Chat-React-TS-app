export interface CurrentUser {
    uid: string;
    id: string,
    username: string | null,
    avatar: string | null,
    blocked: [],
    email: string | null;
}