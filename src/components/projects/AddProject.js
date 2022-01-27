import React from "react";
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, DatePicker, Row, Select, message} from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;

const AddProject = () => {
    let navigate = useNavigate();

    const rangeConfig = {
        rules: [
          {
            type: 'array',
            required: true,
            message: 'Vui lòng chọn thòi gian!',
          },
        ],
    };

    const onFinish = (values) => {
        let data =values;
        const rangeTimeValue = values['range-picker'];
        const projectStart = rangeTimeValue[0].format('YYYY-MM-DD');
        const projectEnd = rangeTimeValue[1].format('YYYY-MM-DD');
        
        data = {...values, projectStart, projectEnd};
        console.log(data)
        axios.post('/api/create', data).then(res => {
            console.log(res);
            if(res.data.code === 200)
            {
                message.success(res.data.message);
                navigate("/projects");
            }
            else if(res.data.code > 200)
            {
                message.error(res.data.message);
            }
        })
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="row container-fluid">
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
                    <Form.Item
                        label="Tên dự án"
                        name="projectName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên dự án!',
                            },
                        ]}
                    >
                        <Input size="large"/>
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
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
                        <Select
                            placeholder="Chọn trạng thái của công việc"
                            allowClear
                            size="large"
                        >
                            <Option value="1">Mới</Option>
                            <Option value="2">Đang thực hiện</Option>
                            <Option value="3">Đã thực hiện</Option>
                            <Option value="4">Hoàn thành</Option>
                            <Option value="5">Quá hạn</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="range-picker" label="Thời gian" {...rangeConfig} >
                        <RangePicker size="large" />
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

export default AddProject;