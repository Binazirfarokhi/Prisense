import {createContext, useContext, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";


const ConfirmContext = createContext();

const useConfirm = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [callback, setCallback] = useState(null);
  return {
    showConfirm: (msg, cb) => {
      setOpen(true);
      setMessage(msg);
      setCallback(() => cb);
    },
    closeConfirm: () => {
      setOpen(false);
      setMessage('');
    },
    open,
    message,
    callback
  }
}

export const ConfirmProvider = ({children}) => {
  const {open, closeConfirm, showConfirm, message, callback} = useConfirm();
  return (
    <ConfirmContext.Provider
      value={
        {
          open,
          closeConfirm,
          showConfirm,
          message,
          callback
        }
      }
    >
      <Dialog
        fullWidth
        onClose={closeConfirm}
        open={open}>
        <DialogTitle> </DialogTitle>
        <DialogContent>
          <Typography color={'gray'}>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (callback) {
                callback();
              }
              closeConfirm();
            }}
          >Confirm</Button>
          <Button
            onClick={closeConfirm}
            color={'inherit'}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {children}
    </ConfirmContext.Provider>
  )
}

export function useConfirmContext() {
  return useContext(ConfirmContext);
}