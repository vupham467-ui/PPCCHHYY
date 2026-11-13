import { useState } from "react";

const useReload = (loadData, delayTime = 500) => {
  const [isReloading, setIsReloading] = useState(false);

  const reload = () => {
    setIsReloading(true);
    setTimeout(async () => {
      await loadData(); 
      setIsReloading(false);
    }, delayTime);
  };

  return { isReloading, reload };
};

export default useReload;
