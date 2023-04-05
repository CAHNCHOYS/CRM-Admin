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




  return {
    elementEnter,
    elementLeave,

  };
};
