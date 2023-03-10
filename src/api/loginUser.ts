import type { LoginResponse } from "@/types/BackendResponses";
import type { LoginFields } from "@/types/FormFields";

export const loginUser = async (userData: LoginFields): Promise<LoginResponse> => {
  try {
    let response = await fetch("http://localhost:3000/api/Login", {
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
      errorMessage: (error as Error).message
    };
  }
};
