//Данные передаваемые в функции с формы
type UserRegisterInfo = {
  name: string;
  email: string;
  password: string;
};

//объект получаемый с запроса 
type RegisterResponse = {
  readonly success?: boolean;
  readonly alreadyRegistered?: boolean; //Если введеный емаил уже есть в бд
  readonly error?: string;
};

export const registerUser = async (userInfo: UserRegisterInfo): Promise<RegisterResponse> => {
  try {
    let response = await fetch("http://localhost:3000/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userInfo)
    });

    let json: RegisterResponse = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message
    };
  }
};
