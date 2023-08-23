import {createContext, useContext, useState} from "react";
import {Alert, Snackbar} from "@mui/material";


const ToastContext = createContext();

const useToastData = () => {

  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [open, setOpen] = useState(false);

  return {
    show: (type, message) => {
      setMessage(message);
      setType(type);
      setOpen(true);
    },
    close: () => {
      setMessage('');
      setOpen(false);
      setType('');
    },
    open,
    message,
    type
  }
}

export const ToastProvider = ({children}) => {
  const value = useToastData();
  return (
    <ToastContext.Provider value={value}>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        autoHideDuration={3000}
        onClose={value.close}
        open={value.open}>
        <Alert
          onClose={value.close}
          severity={value.type}
          sx={{ width: '100%' }}>
          {value.message}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  return useContext(ToastContext);
}

export const ToastTypes = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  SUCCESS: "success"
}