//Пользователь системы 
export interface IUser{
 readonly id: number,
 name: string,
 email: string,
 password: string,
 country: string,
 avatar: string, 
}





export interface IUserProduct {
    readonly id: number;
    name: string;
    price: number;
    count: number;
    category: string;
}

export interface ICustomer {
    id: number;
    name: string;
}

