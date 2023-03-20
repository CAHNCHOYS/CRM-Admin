import gsap from 'gsap';


export const useListAnimations = ()=>{


    const beforeEnter: any = (el: HTMLElement)=>{
       gsap.from(el, {
          y: -200,
          opacity: 0,

       })
    }


    const enter: any = (el: any, done: GSAPCallback)=>{
        
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: el.dataset.index * 2, 
            onComplete: done,
        })
    }

    const afterEnter: any = (el: HTMLElement, done: GSAPCallback)=>{
        console.log("after Enter");
        done;
    }

    const leave: any = (el: any, done: GSAPCallback)=>{
        gsap.to(el, {
            y: 200,
            
       
            opacity: 0,
           
            duration: 0.5,
            onComplete: done,
            
        })
    }
    

   return{
     beforeEnter, 
     enter,
     afterEnter,
     leave,
   }
}