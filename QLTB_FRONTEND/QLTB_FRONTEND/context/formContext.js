import React, { createContext, useContext, useState, useCallback } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formDataChung, setFormDataChung] = useState({});
  const [formDataServer, setFormDataServer] = useState({}); // theo từng server (ma_may_chu)

  const updateChungField = useCallback((field, value) => {
    setFormDataChung((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateServerField = useCallback((ma_may_chu, field, newVal) => {
    setFormDataServer((prev) => ({
      ...prev,
      [ma_may_chu]: {
        ...prev[ma_may_chu],
        [field]: newVal,
      },
    }));
  }, []);

  const resetFormData = (dataChung = {}, dataServer = {}) => {
    setFormDataChung(dataChung);
    setFormDataServer(dataServer);
  };

  return (
    <FormContext.Provider value={{ formDataChung, setFormDataChung, updateChungField, formDataServer, resetFormData, setFormDataServer, updateServerField }}>
      {children}
    </FormContext.Provider>
  );
};


export const useFormContext = () => useContext(FormContext);
