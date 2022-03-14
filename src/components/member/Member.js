import {React, useContext, useEffect, useState} from 'react'
import axios from "axios";
import Table from '../table/Table'
import {useNavigate, useParams } from "react-router-dom";
import 'boxicons';
import { AppContext } from '../context/Context';
import Spinner from '../spinner/Spinner';
import { message, Popconfirm, Button, Form, Input,Select, Row, Col } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

const { Option } = Select;

const projectTableHead = [
    ['STT', 'id', false, 'number'],
    ['Tên thành viên', 'username', true, 'string'],
    ['Email', 'email', true, 'string'],
    ['Vai trò', 'role', false, 'string'],
    ['Action', 'action', false, 'none']
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const Member = () => {
    const navigate = useNavigate();
    const {projectId} = useParams('id');
    const [members, setMembers] = useContext(AppContext).members;
    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(false);
    
    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{++index}</td>
            <td>{item.username}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
            <td>
                <Popconfirm
                    placement="topRight"
                    title="Bạn có chắc chắn muốn thành viên này?"
                    onConfirm={()=>confirmDeleteMember(parseInt(projectId), item.id)}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button icon={<DeleteOutlined color='red'/>}/>
                </Popconfirm>
            </td>
        </tr>
    );

    const confirmDeleteMember = async (projectId,id) => {
        axios.delete(`/api/members/${projectId}/delete/${id}`).then((response) => {
            if (response.data.code === 200) {
                setMembers(members.filter(member => member.id !== id))
                message.success(response.data.message);
            }
            else {
                message.error(response.data.message);
            }
        })
    };

    const onFinish = (values) => {
        let data =values;
        console.log(data);
        axios.post(`/api/members/add/${projectId}`, data).then(res=>{
            console.log(res);
            if(res.data.code === 200)
            {   
                message.success(res.data.message);
                setMembers([...members,res.data.data]);
                setLoading(false);
            }
            else if(res.data.code > 200)
            {
                message.error(res.data.message);
            }
        });
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        console.log(` https://qlvcbackend.herokuapp.com/api/members/${projectId}`);
        axios.get(`/api/members/${projectId}`).then(res=> {
            console.log(res);
            if (res.data.code === 200) {
                setMembers(res.data.data.data);
                setLoading(false);
            }
            else {
                console.log(res.data.message);
            }
        })
        // .catch(error=>navigate('/login'))
    },[projectId, navigate, setMembers]);
    
    const formAdd = 
        <Form layout="vertical"
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Row>
                <Col span={12}>
                    <Form.Item
                        placeholder = 'Nhập email'
                        label="Nhập email của thành viên"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email của thành viên!',
                            },
                        ]}
                        
                    >
                        <Input size="large"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="role" label="Vai trò">
                        <Select
                            placeholder="Chọn vai trò"
                            allowClear
                            size="large"
                        >
                            <Option value="1">Member</Option>s
                            <Option value="2">Developer</Option>
                            <Option value="3">Maintenance</Option>
                            <Option value="4">Customer Support</Option>
                            <Option value="5">BA</Option>
                            <Option value="6">Leader</Option>
                            <Option value="7">Project Management</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                wrapperCol={{
                    offset: 0,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" size="large">
                    Thêm    
                </Button>
            </Form.Item>
        </Form>;

    const toggleButton = (e) => {
        toggle ? setToggle(false): setToggle(true);
    }
    
    if (loading) {
        return <Spinner/>
    }
    else
    return (
        <div>
            <Button className="btn btn-primary btn-block mb-4" onClick={e => toggleButton()}>{toggle ? "Ẩn thêm thành viên": "Thêm thành viên"}</Button>       
                {toggle ? formAdd : ''}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                <Table
                                    limit='10'
                                    headData={projectTableHead} 
                                    renderHead={(item, index) => renderHead(item, index)}
                                    bodyData={members}
                                    renderBody={(item, index) => renderBody(item, index)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Member;
