import gsap from "@/plugins/gsap/index";

export const useListAnimations = () => {
  const elementEnter = (el: Element, done: GSAPCallback) => {
    gsap.from(el, {
      duration: 0.6,
      opacity: 0,
      y: "-50%",


      onComplete: done,
      ease: "power1.out"
    });
  };

  const elementLeave = (el: Element, done: GSAPCallback) => {
    gsap.to(el, {
      duration: 0.6,
      opacity: 0,
      scale: 0,
      x: "100%",
      position: "absolute",
      visibility: "hidden",

      onComplete: done,
      ease: "power1.out"
    });
  };


  const noteEnter = (el: any, done: GSAPCallback) => {
    gsap.from(el, {
      opacity: 0,
      scale: 0,
      ease: "sine.out",
     
      onComplete: done,
      duration: 0.8
    });
  };
  
  const noteLeave = (el: any, done: GSAPCallback) => {
    console.log("leaving");
    gsap.to(el, {
      duration: 0.8,
      ease: "sine.out",
      opacity: 0,
  
      scale: 0,
      onComplete: done
    });
  };

  return {
    elementEnter,
    elementLeave,
    noteEnter,
    noteLeave,
  };
};
