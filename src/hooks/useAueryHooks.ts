import { useEffect, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";

export const useQueryHooks = (query: UseQueryResult<any, any>) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (query.error) {
      console.error("쿼리 로드 중 오류:", query.error);
      setShowModal(true); 
    }
  }, [query.error]);

  return { showModal, setShowModal };
};