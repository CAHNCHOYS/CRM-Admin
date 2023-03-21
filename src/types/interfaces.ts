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
    readonly userId: number;
    name: string;
    price: number;
    count: number;
    category: string;
    categoryId: number;
}

export interface IUserProductCategory{
    id: number;
    name: string;
}

export interface ICustomer {
    id: number;
    name: string;
}

