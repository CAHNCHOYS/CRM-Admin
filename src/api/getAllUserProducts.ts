


export const getAllUserProducts = async (userId: number)=>{
      try {
         const response = await fetch(`http://localhost:3000/api/getAllProducts/${userId}`);

         return await response.json();
      } catch (error) {
        
        console.log(error);
      }


}