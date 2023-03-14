import type { UpdateTokenResponse } from "@/types/BackendResponses";


export const updateToken = async (userId: number): Promise<UpdateTokenResponse> => {

 
  try {
    const response = await fetch("http://localhost:3000/api/UpdateToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id: userId})
    });
    
    const json: UpdateTokenResponse = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return {
      errorMessage: (error as Error).message
    };
  }
};
