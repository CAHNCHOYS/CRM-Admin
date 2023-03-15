import type { LoginResponse } from "@/types/BackendResponses";
import type { LoginFields } from "@/types/Forms";

export const loginUser = async (userData: LoginFields) => {
  try {
    const response = await fetch("http://localhost:3000/api/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
    

    const json: LoginResponse = await response.json();
    console.log(json);
    
    return json;
  } catch (error) {
    console.log(error);
    return { errorMessage: (error as Error).message };
  }
};
