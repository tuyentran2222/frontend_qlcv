import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
// import { AppContext } from "../context/Context";
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';

import { Pagination } from "antd";
export default function CommentList(props) {
    const [comments, setComments] = useState(props.comments.length > 10 ? props.comments.slice(0,10): props.comments);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const onChange = (page, pageSize) =>{
        console.log(page, pageSize);
        setPage(page);
        setPageSize(pageSize);
        setComments(props.comments.slice((page-1)*pageSize, page*pageSize));
    }

    useEffect(()=> {
        let echo = new Echo({
            broadcaster: 'socket.io',
            client: Socketio,
            host: window.location.hostname + ':6001',
            auth: {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        });
        
        let a = echo.join('chat').listen('CommentEvent', (e) => {
            console.log(1);console.log(e);
            // this.setState({
            //     messages: this.state.messages.concat({
            //     message: e.message.message,
            //     user: e.user
            //     })
            // });
        });
        console.log(a)
        setComments(props.comments.slice((page-1)*pageSize, page*pageSize));
    },[props.comments, page, pageSize])
    return (
        <div className="commentList">
            <p><span>{props.comments.length}</span> {' '} Bình luận</p>

            {props.comments.length === 0 && !props.loading ? (
                <div className="alert text-center alert-info">
                    Hãy trở thành người đầu tiên bình luận
                </div>
            ) : null}
            {comments.map((comment, index) => (
                <CommentItem key={index} comment={comment} />
            ))}
            <Pagination
            style={{float:'right'}}
                total={props.comments.length}
                onChange={(page, pageSize)=> onChange(page, pageSize)}
                showSizeChanger
                showQuickJumper
                showTotal={total => `Tổng ${total} bình luận`}
            />
        </div>
    );
}