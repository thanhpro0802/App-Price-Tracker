import { User } from '../models';
export declare class UserRepository {
    findByEmail(email: string): Promise<User | null>;
    create(email: string, hashedPassword: string): Promise<User>;
}
//# sourceMappingURL=UserRepository.d.ts.map