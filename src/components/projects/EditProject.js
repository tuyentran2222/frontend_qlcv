import React, {useState, useEffect} from "react";
import axios from 'axios'
import { useNavigate, Link, useParams} from "react-router-dom";
import { Form, Input, Button, DatePicker, Row, Select, message} from 'antd';
import Spinner from "../spinner/Spinner";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

const EditProject1 = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState({
        projectName : '',
        projectCode : '',
        partner : '',
        status : '',
        projectStart: '',
        projectEnd: ''
    });
  
    const { id } = useParams();
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                message: 'Vui lòng chọn thòi gian!',
            },
        ],
    };

    useEffect(() => {
        const projectId = id;
        axios.get(`/api/projects/edit/${projectId}`).then( res => {
            console.log(res);
            if(res.data.code === 200)
            {
                setProject(res.data.data);
                setLoading(false);
            }
            else if(res.data.code === 404)
            {
                message.error(res.data.status)
                navigate("/projects");
            }
        });
  
    },[navigate, id]);

    const onFinish = (values) => {
        let data =values;
        const rangeTimeValue = values['range-picker'];
        const projectStart = rangeTimeValue[0].format('YYYY-MM-DD');
        const projectEnd = rangeTimeValue[1].format('YYYY-MM-DD');
        
        data = {...values, projectStart, projectEnd};
        console.log(data)
        const projectId = id;
        axios.patch(`http://127.0.0.1:8000/api/projects/update/${projectId}`, data).then( res => {
            console.log(res);
            if(res.data.code === 200)
            {
                message.success(res.data.message);
                setProject(res.data.data);
                setLoading(false);
            }
            else if(res.data.code === 404)
            {
                message.error(res.data.status)
                navigate("/projects");
            }
        });
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    if (loading) {
        return <Spinner/>
    }
    return (
        <div className="row container-fluid">
            {console.log(project)}
            <div className="w-80 mx-auto p-5">
                <Form layout="vertical"
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {console.log(project.projectName)}
                    <Form.Item
                        label="Tên dự án"
                        name="projectName"
                        initialValue={project.projectName}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên dự án!',
                            },
                        ]}

                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Mã dự án"
                        name="projectCode"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mã dự án!',
                            },
                        ]}
                        initialValue={project.projectCode}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Đối tác"
                        name="partner"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập đối tác!',
                            },
                        ]}
                        initialValue={project.partner}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái" rules={[{ message: "Vui lòng chọn trạng thái" }]}>
                        <Select
                            placeholder="Chọn trạng thái của công việc"
                            allowClear
                            size="large"
                            defaultValue={`${project.status}`}
                        >
                            <Option value="1">Mới</Option>
                            <Option value="2">Đang thực hiện</Option>
                            <Option value="3">Đã thực hiện</Option>
                            <Option value="4">Hoàn thành</Option>
                            <Option value="5">Quá hạn</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="range-picker" label="Thời gian" {...rangeConfig} >
                        <RangePicker size="large" defaultValue={[moment(project.projectStart, dateFormat), moment(project.projectEnd, dateFormat)]} />
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
                    <Form.Item
                        wrapperCol={{
                            offset: 0,
                            span: 16,
                        }}
                        
                    >
                        <Link className="btn btn-danger btn-block" style={{height:"40px" , marginLeft:"10px"}}  to={'/projects'}>Hủy</Link>
                    </Form.Item>
            
                    </Row>
            
                </Form>
            </div>
        </div>
    );
};

export default EditProject1;