import { User } from "@supabase/supabase-js"

export interface AuthProvider {
    getUserId(): Promise<string | null>
    getUser(): Promise<User | null>
    signInWithEmail(email: string, password: string): Promise<User>
    signUp(email: string, password: string): Promise<User | null>
    signOut(): Promise<void>
    requestPasswordReset(email: string): Promise<void>
    resetPassword(newPassword: string, token: string): Promise<void>

}   