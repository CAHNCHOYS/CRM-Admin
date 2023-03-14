//Данные передаваемые в функции с формы

//объект получаемый с запроса
import type { RegisterResponse } from "@/types/BackendResponses";
import type { RegisterFields } from "@/types/FormFields";

export const registerUser = async (userInfo: RegisterFields): Promise<RegisterResponse> => {
  
  try {
    const response = await fetch("http://localhost:3000/api/Registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userInfo)
    });

    const json: RegisterResponse = await response.json();
    
    return json;
  } catch (error) {
    console.log(error);
    return {
      errorMessage: (error as Error).message
    };
  }
};
