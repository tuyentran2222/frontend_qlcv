import React, { useContext, useEffect, useState } from "react";
import './comment.css';
import axios from "axios";
import FromNow from './../time/FromNow'
import { AppContext } from "../context/Context";
import {EllipsisOutlined, MoreOutlined, CloseCircleOutlined, SendOutlined, DeleteOutlined} from '@ant-design/icons'
import { Button, Menu, Dropdown, Input, Popconfirm, message, Avatar, Image, Tooltip ,Comment} from "antd";

import moment from "moment";
const { TextArea } = Input;
export default function CommentItem(props) {
    const [comments, setComments] = useContext(AppContext).comments;
    const { name, time, avatar, id, comment_id } = props.comment;
    let content = props.comment.message;
    const [comment,setComment] = useState(content)
    const user = JSON.parse(localStorage.getItem('user'));
    const [editable, setEditable] = useState(false);

    const menu = (
        <Menu>
            <Menu.Item onClick={()=> changeEditable()}>
                Sửa bình luận
            </Menu.Item>
            <Menu.Item >
                <Popconfirm
                    placement='bottomRight'
                    title='Bạn có chắc chắn muốn xóa bình luận này?'
                    onConfirm={()=>deleteComment()}
                    okText='Xóa'
                    cancelText='Hủy'
                >
                     Xóa bình luận
                </Popconfirm>
               
            </Menu.Item>
        </Menu>
    );

    useEffect(()=>{
        setComment(content)
    },[content])
    
    const renderEdit = () => {
        if (user.id === id) return <div className="col-12">
            <div className="d-flex flex-row-reverse mt-2">
                <Dropdown overlay={menu} placement="topRight">
                    <Button>
                        <MoreOutlined />
                    </Button>
                </Dropdown>
            </div>
        </div>
    }

    const deleteComment = () => {
        let end_point =  `/api/comments/delete/${comment_id}`;
        axios.delete(end_point).then(res=> {
            if (res.data.code === 200) {
                message.success(res.data.message);
                setComments(comments.filter((comment) => {
                    return comment.comment_id !== comment_id;
                }))
            }
            if (res.data.code > 200) {
                message.error(res.data.message);
            }
        })
    }

    const changeEditable = () => {
        setEditable(!editable);
    }

    const onInputChange = (e) => {
        setComment(e.target.value);
    }

    const onUpdateComment = (e) => {
        e.preventDefault();
        const updatedComment = {'comment': comment};
        axios.post(`/api/comments/update/${comment_id}`, updatedComment).then(res=>{
            console.log(res)
            if(res.data.code === 200)
            {
                message.success(res.data.message);
                setEditable(false);
            }
            else message.error(res.data.message);
        });
    }

    if (editable) return (
        <div className="media mb-3 row">
            <div className="col-1">
                <Avatar class="ant-image-img" src={` http://localhost:8000${avatar}`} alt="Avatar" style={{border:"50% 50%"}}></Avatar>
            </div>
            <div className="media-body p-2 shadow-sm rounded bg-light border col-11">
                <div className="row">
                    <h6 className="mt-0 mb-1 text-muted float-start col-6">{name}</h6>
                    <small className=" text-muted float-end text-end col-6">{FromNow(time)}</small>
                </div>
                <div className="row" style={{paddingLeft:"10px", paddingRight:"10px"}}>
                    <TextArea
                        id="comment"
                        type="textarea"
                        // className="form-control"
                        placeholder="Nhập bình luận"
                        name="comment"
                        rows={3}
                        value={comment}
                        onChange={e => onInputChange(e)}
                    ></TextArea>
                    <div className="d-flex flex-row-reverse mt-2">
                        <Dropdown overlay={menu} placement="topRight">
                            <Button>
                                <EllipsisOutlined />
                            </Button>
                        </Dropdown>
                        <Button onClick={()=> changeEditable()}><CloseCircleOutlined style={{color:'red'}} color="red" /></Button>
                        <Button onClick={(e) => onUpdateComment(e)}><SendOutlined style={{color:'#1479fb'}} /></Button>
                        
                        {/* <button className="btn btn-primary float-right mr-2" style={{width:'60px'}}  onClick={(e) => onUpdateComment(e)} ><i className='bx bx-send'></i></button>
                        <button className="btn btn-danger float-right" style={{width:'60px'}}  onClick={()=> changeEditable()}><i className='bx bx-message-square-x'></i></button> */}
                    </div>
                    
                </div>
                
            </div>
        </div>
    )

    else
    return (
        <div className="media mb-3 row media-body shadow-sm rounded bg-light border" style={{border:'1px solid black'}}>
            <Comment
                // actions={actions}
                author={name}
                avatar={ <Avatar src={<Image src={` http://localhost:8000${avatar}`} />} />}
                content={
                    <div className="row" >
                        <p className='col-11'>
                            {comment}
                        </p>
                        <div className='col-1'>
                        {
                            renderEdit()
                        }
                        </div>
                    </div>
                    
                }
                datetime={
                    <Tooltip title={moment(time).format('YYYY-MM-DD HH:mm:ss')}>    
                    <span>{FromNow(time)}</span>
                    </Tooltip>
                }
            />    
            {/* <div className="col-1">
                <Avatar src={<Image src={` http://localhost:8000/${avatar}`} />} />
            </div>
            <div className="media-body p-2 shadow-sm rounded bg-light border col-11">
                <div className="row">
                    <h6 className="mt-0 mb-1 text-muted float-start col-6">{name}</h6>
                    <small className=" text-muted float-end text-end col-6">{FromNow(time)}</small>
                </div>
                <div className="row">
                    <div className="col-11">
                        <p>{comment}</p>
                    </div>
                    {
                        renderEdit()
                    }
                </div>
            </div> */}
        </div>
    );
}