import type { DeleteAccountResponse } from "@/types/BackendResponses";


export const deleteAccount = async (userId: number): Promise<DeleteAccountResponse> => {
  try {
    const response = await fetch("http://localhost:3000/api/DeleteAccount", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id: userId})
    });
    const json: DeleteAccountResponse = await response.json();

    return json;
  } catch (error) {
    console.log(error);
    return {
      errorMessage: (error as Error).message
    };
  }
};
