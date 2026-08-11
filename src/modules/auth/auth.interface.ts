export interface ILoginUser {
    email: string;
    password: string;
}

export interface IUpdateUser {
    name?: string;
    phone?: string;
    imageUrl?: string;
    address?: string;
    city?: string;
}