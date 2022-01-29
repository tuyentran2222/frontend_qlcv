import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AppContext } from "../context/Context";
import {Input, Button, message} from 'antd';
const {TextArea} = Input;
const CommentForm = (props) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useContext(AppContext).comments;
    const onInputChange = (e) => {
      setComment(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const newComment = {'comment': comment};
        axios.post(`/api/tasks/${props.taskId}/comment/add`, newComment).then(res=>{
            console.log(res)
            if(res.data.code === 200)
            {
                message.success(res.data.message);  
                setComment('');
                setComments([res.data.data, ...comments])
                console.log(comments)
            }
        });
    }
    return (
        <div>
            <form onSubmit={e => onSubmit(e)} method="post" className="col-12">
                <div className="input-group">
                    <div className='col-12 input-form'>
                        <TextArea
                            id="comment"
                            type="textarea"
                            placeholder="Nhập bình luận"
                            name="comment"
                            rows={3}
                            value={comment}
                            onChange={e => onInputChange(e)}
                        ></TextArea>
                    {/* <CKEditor className="mt-3 wrap-ckeditor" editor={ClassicEditor} /> */}
                    {/* <i className='bx bx-camera'></i> */}
                    </div>
                        <div className="col-12 input-form" >
                        <button className="btn btn-primary" type="submit" style={{float:'right'}}>Bình luận</button>
                    </div>
                    
                </div>
            </form>                                     
        </div>
    );
  
}
export default CommentForm;
