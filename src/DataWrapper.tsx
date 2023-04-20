import { ReactNode } from "react";

// * If you need to dynamically initialize data, you could do it here

export const DataWrapper = ({ children }: { children: ReactNode }) => {
  // useEffect(() => {
  //   setStoreData({
  //     array1: ["el1", "el2", "el3"],
  //     data1: "data1",
  //     data2: {
  //       data1: "data2-1",
  //     },
  //     data3: {
  //       data1: "data3-1",
  //       data2: {
  //         data1: "data3-2-1",
  //       },
  //     },
  //   });
  // }, []);

  return <>{children}</>;
};
