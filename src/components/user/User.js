
import {React, useContext, useEffect, useState} from 'react'
import '../user/user.css'
import axios from "axios";
import {useNavigate } from "react-router-dom";
import 'boxicons';
import Genders from '../../assets/json/gender.json'
import ImgPrev from '../imageprev/ImgPrev';
import { AppContext } from '../context/Context';
import Spinner from '../spinner/Spinner';
import { message } from 'antd';
import { Form, Input, Button, Row, Select, Col} from 'antd';

const { Option } = Select;
const User = () => {
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useContext(AppContext).avatar;
    const navigate = useNavigate();
 
    const [user, setUser] = useState({
        username: "",
        firstname: "",
        lastname: "",  
        avatar: avatar,
        gender: "",
        email: "",
        id: '',
    });

    const handleGenderChange = (value) => {
        console.log(value);
    }
    
    const onFinish = (values) => {
        if (! values.gender) values.gender = user.gender;
        values.avatar = avatar;
        const _formData = new FormData();
        _formData.append("username", values.username);
        _formData.append("avatar", avatar);
        _formData.append("gender", values.gender );
        _formData.append("firstname",values.firstname);
        _formData.append("lastname",values.lastname);
        axios.post(`/api/user/update`, _formData).then(res=> {
            if (res.data.code === 200) {
                console.log(res.data.data);
                setUser(JSON.stringify(res.data.data))
                message.success("Cập nhật thành công")
            }
            else message.error("Cập nhật thông tin thất bại");
        });

    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const { username, firstname, lastname, gender, email, id } = user;
    
    useEffect(() => {
        axios.get("/api/getUser").then(res=> {
            if (res.data.code === 200) {
                localStorage.setItem('user', JSON.stringify(res.data.data))
                setUser(res.data.data);
                setLoading(false);
            }
        }).catch((error) => navigate('/login'));
    }, [navigate]);

    if (loading) return <Spinner/>
    return (
        <>
            <div className="row">
                <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <ImgPrev></ImgPrev>
                            {/* <img style={{maxWidth:'100%'}} className="rounded-circle mt-5" src={`http://localhost:8000${user.avatar}`} alt='Ảnh đại diện'/> */}
                            <span className="font-weight-bold">{username}</span>
                            <span className="text-black-50">{email}</span><span> </span></div>
                    </div>
                    <div className="col-md-9 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Cài đặt hồ sơ người dùng</h4>
                            </div>
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
                                            label="First Name"
                                            name="firstname"
                                            initialValue={firstname}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập first name!',
                                                },
                                            ]}
                                        >
                                            <Input size="large"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Last Name"
                                            name="lastname"
                                            initialValue={lastname}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập last name!',
                                                },
                                            ]}
                                        >
                                            <Input size="large" />
                                        </Form.Item>                        
                                    </Col>
                                </Row>
                                <Form.Item
                                    label="Giới tính"
                                    name="gender"
                                >
                                    <Select defaultValue={gender} size='large' style={{ width: "100%" }} onChange={handleGenderChange}>
                                        {Genders.map((item) => {
                                            return <Option key={item.value} value={item.value} >{item.label} </Option>;
                                        })}
            
                                    </Select>
                                </Form.Item> 

                                <Form.Item
                                    label="Username"
                                    name="username"
                                    initialValue={username}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập username!',
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Row>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 0,
                                            span: 16,
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit" size="large">
                                            Lưu
                                        </Button>
                                    </Form.Item>
                                </Row>
                        
                            </Form>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default User;
