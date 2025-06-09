export interface IUser {
    _id: string;
    userName: string;
    email: string;
    role: string;
    permission?: string[];
    password?: string;
}
