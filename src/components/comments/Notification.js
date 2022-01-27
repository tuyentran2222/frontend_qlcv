import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { AppContext } from "../context/Context";

const config ={
  headers: {
  Authorization: "Bearer " + localStorage.getItem('token')
  }
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notification = () => {
    const vertical = 'top';
    const horizontal = 'right';
    const [open, setOpen] = useState(false);
    const handleClose = (event, reason) => {
      if (reason === '') {
        return;
      }
      setOpen(false);
    };
    return(
    <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{vertical, horizontal}}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm bình luận thành công!
          </Alert>       
        </Snackbar>
    );
}
export default Notification;
