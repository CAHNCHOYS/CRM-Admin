import type { UpdatePasswordResponse } from "@/types/BackendResponses";
import type { UpdatePasswordFields } from "@/types/Forms";

export const updatePassword = async (
  userPasswords: UpdatePasswordFields,
  userId: number
): Promise<UpdatePasswordResponse> => {
  try {
    const response = await fetch("http://localhost:3000/api/UpdateUserPassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...userPasswords, id: userId })
    });
    
    const json: UpdatePasswordResponse = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return {
      errorMessage: (error as Error).message,
    };
  }
};
