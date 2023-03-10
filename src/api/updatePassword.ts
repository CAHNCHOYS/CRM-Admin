import type { UpdatePasswordResponse } from "@/types/BackendResponses";
import type { UpdatePasswordFields } from "@/types/FormFields";

export const updatePassword = async (
  userPasswords: UpdatePasswordFields,
  userId: number
): Promise<UpdatePasswordResponse> => {
  try {
    let response = await fetch("http://localhost:3000/api/UpdateUserPassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...userPasswords, id: userId })
    });
    
    let json: UpdatePasswordResponse = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return {
      errorMessage: (error as Error).message,
    };
  }
};
