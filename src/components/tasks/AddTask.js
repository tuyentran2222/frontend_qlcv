import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";

import { Form, Input, Button, DatePicker, Row, Col, Select, InputNumber, message} from 'antd';
import Spinner from "../spinner/Spinner";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

function handleChange(value) {
  console.log(`Selected: ${value}`);
}

const AddTask = () => {
    const {parent_id, project_id} =  useParams();
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [projectNames, setProjectNames] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const onFinish = (values) => {
        console.log(values)
        let data =values;
        const rangeTimeValue = values['range-time-picker'];
        const taskStart = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss');
        const taskEnd = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss');
        const taskPersonIds = values.taskPersonId.join(",");
        data = {...values, taskStart, taskEnd, taskPersonIds};
        let pid = 0;
        if (parent_id) pid = parent_id;

        axios.post(`/api/tasks/create/${pid}/projects/${project_id}`, data).then(res => {
            console.log(res);
            if(res.data.code === 200)
            {
                message.success(res.data.message)
                navigate(-1);
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

    const rangeConfig = {
        rules: [
        {
            type: 'array',
            required: true,
            message: 'Chọn thời gian!',
        },
        ],
    };

    useEffect(() => {
        axios.get("/api/getAllProjects").then(res=> {
            if (res.data.code === 200) {
                setProjectNames(res.data.data);
                setLoading(false);
            }
            if (res.data.code === 500) {
                navigate('/login');
            }
            console.log(res.data.data);
        });
        axios.get(`/api/members/memberInfo/${project_id}`).then( res => {
            if(res.data.code === 200)
            {
                console.log(res.data.data);
                setAllMembers(res.data.data)
            }
            
        });
        axios.get(`/api/members/${project_id}`).then(res=> {
            if (res.data.code === 200) {
                setMembers(res.data.data);
            }
            if (res.data.code === 500) {
                navigate('/login');
            }
            console.log(res.data.data);
        });
    }, [project_id]);

    if (loading) return <Spinner/>;
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
                    label="Tên công việc"
                    name="taskName"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên công việc!',
                        },
                    ]}
                >
                    <Input size="large"/>
                </Form.Item>

                <Form.Item
                    label="Mã công việc"
                    name="taskCode"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mã công việc!',
                        },
                    ]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label="Mô tả chi tiết công việc"
                    name="taskDescription"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả công việc!',
                        },
                    ]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                
                <Form.Item name="range-time-picker" label="Thời gian" {...rangeConfig}>
                    <RangePicker size="large" showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Row>
                    <Col span={12} >
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
                    </Col>
                    <Col span={12} >
                        <Form.Item
                            name={`levelCompletion`}
                            label={`Mức độ hoàn thành`}
                            style={{ width: 'calc(100% - 8px)', margin: '0 0px 0 0px' }}
                            rules={[
                            {
                                required: true,

                                message: 'Vui lòng chọn mức độ hoàn thành!',
                            },
                            ]}
                        >
                        <InputNumber style={{width:'400px !important'}} placeholder="Mức độ hoàn thành" min={0} max={100} size="large"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="projectCode" label="Dự án" rules={[{ required: true, message:"Vui lòng chọn dự án" }]}>
                    <Select
                        placeholder="Chọn dự án"
                        allowClear
                        size="large"
                    >
                    {projectNames.map((element,index) => {
                    return <Option value={element.projectId}>{element.projectName}</Option>;
                    })}
                    {console.log(projectNames)}
                    </Select>
                </Form.Item>

                <Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}>
                    <Select
                        placeholder="Chọn mức độ ưu tiên"
                        allowClear
                        size="large"
                    >
                        <Option value="1">Cao</Option>
                        <Option value="2">Trung bình</Option>
                        <Option value="3">Thấp</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="taskPersonId" label="Người nhận việc" rules={[{ required: true, message:"Vui lòng chọn người nhận việc!" }]}>
                    <Select
                        mode="tags"
                        size ="large"
                        
                        placeholder="Please select"
                        defaultValue={[]}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    >
                        {allMembers.map((element,index) => {
                            return <Option key={element.id}>{element.name}</Option>;
                        })}
                    </Select>
                </Form.Item>
                <Row>
                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" size="large">
                        Submit
                    </Button>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 16,
                    }}
                >
                    <Button type="danger" htmlType="submit" size="large">
                        Hủy
                    </Button>
                </Form.Item>
                </Row>
        
            </Form>
            </div>
        </div>
  );
};

export default AddTask;