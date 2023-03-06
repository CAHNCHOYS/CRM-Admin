import type { IUser } from "@/types/index";

type UserLoginData = {
  password: string;
  email: string;
};


type LoginResponse = {
  error?: string;
  wrongPassword?: boolean;
  noExistEmail?: boolean;
  loginData?: {      //Если авторизация удалась получаем токен
     token: string,
     user: IUser,
  }
};
 

export const loginUser = async (userData: UserLoginData): Promise<LoginResponse> => {
  try {
    let response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    let json: LoginResponse = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message
    };
  }
};
