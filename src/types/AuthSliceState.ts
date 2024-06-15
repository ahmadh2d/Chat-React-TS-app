import { CurrentUser } from './CurrentUser';

export interface AuthSliceState {
    currentUser: CurrentUser | null;
    isLoading: boolean;
    error: Error | null;
}