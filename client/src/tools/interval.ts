import React from "react";

const useInterval = (callback: ()=>any, delay: number) => {
  let savedCallback = React.useRef<()=>any>();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    const tick = () => {
      if(savedCallback.current) savedCallback.current();
    }
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export { useInterval };