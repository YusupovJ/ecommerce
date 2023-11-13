interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    age: number;
}

interface INewUser {
    name?: string;
    email?: string;
    password?: string;
    age?: number;
}

interface IError {
    message: string;
    status: number;
}

interface IUserFindAllQuery {
    page: number;
}

interface IParamsID {
    id: number;
}
