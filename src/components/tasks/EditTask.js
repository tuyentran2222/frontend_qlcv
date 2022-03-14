import React, {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams, Link} from 'react-router-dom';
import axios from 'axios';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import { AppContext } from "../context/Context";
import Table from '../table/Table';
import { Form, Input, Button, DatePicker, Row, Col, Select, InputNumber, message, Popconfirm} from 'antd';
import Spinner from '../spinner/Spinner';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const handleChange = (value) => {
    console.log(`Selected: ${value}`);
}
const status = [
  'Chọn trạng thái','Mới', "Đang thực hiện", "Đã thực hiện", "Hoàn thành", "Quá hạn"
]
const priority = [
  'Chọn mức độ ưu tiên' ,'Cao', "Trung bình", "Thấp"
]

const taskTableHead = [
    ['STT', 'id', false, 'number'],
    ['Tên công việc', 'taskName', true, 'string'],
    ['Mã công việc','taskCode', true, 'string'],
    ['Thời gian bắt đầu', 'taskStart' , true, 'date'],
    ['Trạng thái', 'status' , false, 'number'],
    ['Mức độ hoàn thành(%)', '', true , 'number'],
    ['Mức độ ưu tiên', 'priority', false, 'string'],
    ['Action', 'actiolevelCompletionn', false, 'none']
];

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{index+1}</td>
        <td>{item.taskName}</td>
        <td>{item.taskCode}</td>
        <td>{item.taskStart}</td>
        <td><span>{status[item.status+1]}</span></td>
        <td>{item.levelCompletion}</td>
        <td>{priority[item.priority]}</td>
        <td style={{display:'flex', flexDirection:'row'}}>
            {item.role === "Thành viên"?'' :<a className="btn mr-2" href={`/project/${item.projectId}/task/edit/${item.id}`}>
                <EditOutlined />
            </a>
            }
            {item.role === "Thành viên"?'' :
            <Popconfirm
                placement="topRight"
                title="Bạn có chắc chắn muốn xóa công việc này?"
                onConfirm={()=>confirmDeleteTask(item.id)}
                okText="Yes"
                cancelText="No"
            >
                <Button style={{border:"none", background:"transparent"}}><DeleteOutlined style={{color:"red"}} /></Button>
            </Popconfirm>
            }
        </td>
    </tr>
);

const confirmDeleteTask = async id => {
    axios.delete(`/api/tasks/delete/${id}`).then((response) => {
        if (response.data.code === 200) {
            message.success(response.data.message);
        }
        else {
            message.error(response.data.message);
        }
    })
};
const dateFormat = 'YYYY-MM-DD hh:mm:ss';

function EditTask(props) {
    let navigate = useNavigate();
    const { projectId ,id } = useParams();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useContext(AppContext).comments;
    const [childTasks, setChildTasks] = useState([]);
    const [projectNames, setProjectNames] = useState([]);
    const [members, setMembers] = useState([]);
    const [pid, setPid] = useState(projectId);
    const [task, setTask] = useState({
        taskName: "",
        taskCode: "",
        taskDescription: "",  
        status: 0,
        taskStart: "",
        taskEnd: "",
        levelCompletion : 0,
        projectCode: projectId,
        priority: 0,
        projectName: '',
        taskPersonIds: ""
    });

    const [initExecutors, setInitExecutors] = useState([]);
    const onFinish = (values) => {
        let data =values;
        const rangeTimeValue = values['range-time-picker'];
        const taskStart = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss');
        const taskEnd = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss');
        values.priority = values.priority ? values.priority: task.priority ;
        values.projectCode = values.projectCode ? values.projectCode : projectId;
        values.status = values.status ? values.status : task.status;
        values.taskPersonId = values.taskPersonId ? values.taskPersonId : initExecutors;
        const taskPersonIds = values.taskPersonId.join(",");
        data = {...values, taskStart, taskEnd, taskPersonIds};
        console.log(data);
        axios.post(`/api/tasks/update/${id}`, data).then(res=>{
          
            if(res.data.code === 200)
            {
                message.success(res.data.message);
                navigate('/tasks');
            }
            else if(res.data.code === 422)
            {
                message.error("Cần điền đầy đủ các trường");
            }
            else if(res.data.code === 404)
            {
                message.error(res.data.message);
                navigate('/tasks');
            }
        });
    
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    const rangeConfig = {
        rules: [
          {
            type: 'array',
            required: true,
            message: 'Vui lòng chọn thời gian công việc!',
          },
        ],
    };

    useEffect(() => {
        const taskId = id;
        axios.get(`/api/members/memberInfo/${projectId}`).then( res => {
            if(res.data.code === 200)
            {
               setMembers(res.data.data);
            }
            else
            {
                message.error(res.data.message);
                navigate("/tasks");
            }
          
        });
        axios.get(`/api/task/${taskId}/executors/`).then( res => {
            if(res.data.code === 200)
            {
               setInitExecutors(res.data.data);
            }
            else
            {
                message.error(res.data.message);
                navigate("/tasks");
            }
          
        });
        axios.get(`/api/tasks/edit/${taskId}`).then( res => {
            if(res.data.code === 200)
            {
                setTask(res.data.data.data);
                setComments(res.data.data.comments);
                setChildTasks(res.data.data.childTasks);
                setInitExecutors(res.data.data.executor);
                setLoading(false);
            }
            else
            {
                message.error(res.data.message);
                navigate("/tasks");
            }
          
        });

        axios.get("/api/getAllProjects").then(res=> {
            if (res.data.code === 200) {
                setProjectNames(res.data.data);
            }
            if (res.data.code === 500) {
                navigate('/login');
            }
            
            axios.get(`/api/members/${projectId}`).then(res=> {
                if (res.data.code === 200) {
                    setMembers(res.data.data.data);
                }
                else {
                    message.error("Đã có lỗi xảy ra");
                    console.log("Error");
                }
            })
        });

    }, [navigate, projectId,setComments, id]);
    

    if (loading) {
        return <Spinner/>
    }
    return (
        <>
            <div className="row">
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
                            initialValue={task.taskName}
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
                            initialValue={task.taskCode}
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
                            initialValue={task.taskDescription}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        
                        <Form.Item name="range-time-picker" label="Thời gian" {...rangeConfig}>
                            <RangePicker size="large" showTime format="YYYY-MM-DD HH:mm:ss" defaultValue={[moment(task.taskStart, dateFormat), moment(task.taskEnd, dateFormat)]} />
                        </Form.Item>
                        <Row>
                            <Col span={12} >
                                <Form.Item name="status" label="Trạng thái">
                                    <Select
                                        placeholder="Chọn trạng thái của công việc"
                                        allowClear
                                        size="large"
                                        defaultValue={`${task.status}`}
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
                                    initialValue={task.levelCompletion}
                                >
                                <InputNumber style={{width:'400px !important'}} placeholder="Mức độ hoàn thành" min={0} max={100} size="large"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="projectCode" label="Dự án">
                            <Select
                                placeholder="Chọn dự án"
                                allowClear
                                size="large"
                                defaultValue={task.projectId}
                            >
                            {projectNames.map((element) => {
                                return <Option value={element.projectId}>{element.projectName}</Option>;
                                
                            })}

                            </Select>
                        </Form.Item>

                        <Form.Item name="priority" label="Mức độ ưu tiên">
                            <Select
                                placeholder="Chọn mức độ ưu tiên"
                                allowClear
                                size="large"
                                defaultValue={`${task.priority}`}
                            >
                                <Option value="1">Cao</Option>
                                <Option value="2">Trung bình</Option>
                                <Option value="3">Thấp</Option>
                            </Select>
                        </Form.Item>
                        {console.log(initExecutors)}
                        <Form.Item name="taskPersonId" label="Người nhận việc">
                            <Select
                                mode="tags"
                                size ="large"
                                placeholder="Please select"
                                defaultValue={initExecutors}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            >
                            {members.map((element,index) => {
                                return <Option key={element.id}>{element.username}</Option>;
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
                            <Button type="danger" htmlType="button" size="large" >
                                Hủy
                            </Button>
                        </Form.Item>
                        </Row>
                
                    </Form>
                </div>
            </div>
            <div className="child-tasks" style={{width:'92%', margin:'auto'}}>
                <h6>Công việc con cần thực hiện</h6>
                <div className="row" style={{marginBottom:'10px'}}>
                    <div className="col-12">
                            <div className="card">
                            <div className="card__body">
                                <Table
                                    limit='10'
                                    headData={taskTableHead} 
                                    renderHead={(item, index) => renderHead(item, index)}
                                    bodyData={childTasks}
                                    renderBody={(item, index) => renderBody(item, index)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <Link to={'/tasks/add/'+ id + '/project/'+ task.projectId}><Button type='primary' size='large'>Thêm công việc con</Button></Link>
            </div>
            <hr></hr>
            <br/>
        
            <div className='comment-container w-80'>
                    <div className="row">
                        <div className="col-12">
                            <h6>Bình luận</h6>
                            <CommentForm taskId = {id}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <CommentList comments= {comments}></CommentList>
                        </div>
                    </div>
            </div>
        </>
    );
};

export default EditTask;