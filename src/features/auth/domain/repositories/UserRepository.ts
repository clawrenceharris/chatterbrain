import { User } from "../entities/User";

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    create(user: User): Promise<void>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}