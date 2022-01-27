import axios from 'axios';
import 'boxicons';
import { React, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/spinner/Spinner';
import Table from '../components/table/Table';
import {FilterOutlined, PlusSquareOutlined, ReloadOutlined}  from '@ant-design/icons'
import { Button } from 'antd';
import { message, Popconfirm} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

const status = [
    'Chọn trạng thái','Mới', 'Đang thực hiện', 'Đã thực hiện', 'Hoàn thành', 'Quá hạn'
]
const priority = [
    'Chọn mức độ ưu tiên' ,'Cao', 'Trung bình', 'Thấp'
]

const taskTableHead = [
    ['STT', 'id', false, 'number'],
    ['Tên công việc', 'taskName', true, 'string'],
    ['Mã công việc','taskCode', true, 'string'],
    ['Thời gian bắt đầu', 'taskStart' , true, 'date'],
    ['Trạng thái', 'status' , false, 'number'],
    ['Mức độ hoàn thành(%)', 'levelCompletion', true , 'number'],
    ['Mức độ ưu tiên', 'priority', false, 'string'],
    ['Tên dự án', 'projectName', false, 'string'],
    ['Action', 'action', false, 'none']
];

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{index+1}</td>
        <td>{item.taskName}</td>
        <td>{item.taskCode}</td>
        <td>{item.taskStart}</td>
        <td><span>{status[item.status]}</span></td>
        <td>{item.levelCompletion}</td>
        <td>{priority[item.priority]}</td>
        <td>{item.projectName}</td>
        <td style={{display:'flex', flexDirection:'row'}}>
            {item.role === 'Thành viên'?'' :<Link className='btn mr-2' to={`/project/${item.projectId}/task/edit/${item.id}`}>
                <i className='bx bx-edit'></i>
            </Link>
            }
            {item.role === 'Thành viên' ? '' :             
            <Popconfirm
                placement='topRight'
                title='Bạn có chắc chắn muốn xóa công việc này?'
                onConfirm={()=>confirmDeleteTask(item.id)}
                okText='Yes'
                cancelText='No'
            >
                <Button type='text'><DeleteOutlined style={{color:'red'}} /></Button>
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

const Tasks = (props) => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initTasks, setInitTasks] = useState([]);
    const {id} = useParams();
    const [task, setTask] = useState({
        taskName: '',
        taskCode: '',
        status: '',
        levelCompletion : '',
        priority : '',
        taskStart: '',
        taskEnd: ''
    });

    const { taskName, taskCode, status, priority, taskStart, taskEnd } = task;
    const onInputChange = e => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const onSubmit =  e => {
        e.preventDefault();
        let pStart, pEnd;
        pStart = (taskStart === '') ? '1970-01-01' : taskStart; 
        pEnd = (taskEnd === '') ? '2970-01-01' : taskEnd;
        let filterData = initTasks
        .filter( d => d.taskName.toLowerCase().includes(taskName.toLowerCase()))
        .filter( d => d.taskCode.toLowerCase().includes(taskCode.toLowerCase()))
        .filter(d=>new Date(d.taskStart) > new Date(pStart))
        .filter(d=>new Date(d.taskEnd) < new Date(pEnd));
        if (status > 0)
        filterData =filterData.filter(d =>parseInt(d.status) === parseInt(status));
        if (priority > 0)
        filterData =filterData.filter(d => parseInt(d.priority) === parseInt(priority));
        setTasks(filterData);
        setLoading(false);        
    };

    const onRefresh = (e) => {
        e.preventDefault();
        setTasks(initTasks);
        setTask({
            taskName: '',
            taskCode: '',
            status: '',
            levelCompletion : '',
            priority : '',
            taskStart: '',
            taskEnd: ''
        });
    }

    useEffect(() => {
        let end_point;
        if (props.type==='project')  end_point =  `/api/projects/${id}/tasks`;
        else if (props.type==='task') end_point =`/api/tasks/assigned`;
        else end_point =`/api/tasks/overtime`;
        axios.get(end_point).then(res=> {
            if (res.data.code === 200) {
                setTasks(res.data.data.data);
                setInitTasks(res.data.data.data);
                setLoading(false);
            }
            if (res.data.code === 401) {
                navigate('/login');
            }
        })
    }, [props.type, id, navigate ]);

    if (loading) return <Spinner/>
    return (
        <>
            <div className='row filter-bar' style={{margin:'10px 0px 10px 0px'}}>
                <form onSubmit={e => onSubmit(e)} className=' filter-table col-12'>
                    <div className='input-group'>
                        <div className='col-4 input-form'>
                            <input
                                id='taskName'
                                type='text'
                                className='form-control'
                                placeholder='Tên công việc'
                                name='taskName'
                                value={taskName}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <div className='col-4 input-form'>
                            <input
                                id='taskCode'
                                type='text'
                                className='form-control'
                                placeholder='Mã công việc'
                                name='taskCode'
                                value={taskCode}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <div className='col-4 input-form'>
                            <select name='priority' className='col-4 form-control' value={priority} onChange={e => onInputChange(e)}>
                                <option value='0' >Chọn mức độ ưu tiên</option>
                                <option value='1' >Cao</option>
                                <option value='2'>Trung bình</option>
                                <option value='3'>Thấp</option>
                                
                            </select>
                        </div>
                    </div>
                    
                    <div className='input-group'>
                        <div className='col-4 input-form'>
                            <select name='status' className='col-4 form-control' onChange={e => onInputChange(e)}>
                                <option value='1' >Chọn trạng thái</option>
                                <option value='1' >Mới</option>
                                <option value='2'>Đang thực hiện</option>
                                <option value='3'>Đã thực hiện</option>
                                <option value='4'>Hoàn thành</option>
                            </select>
                        </div>
                        <div className='col-4 input-form'>
                            <input
                                id='taskStart'
                                type='date'
                                className='col-4 form-control'
                                placeholder='Thời gian bắt đầu'
                                name='taskStart'
                                value={taskStart}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <div className='col-4 input-form'>
                            <input
                                id='taskEnd'
                                type='date'
                                className='col-4 form-control'
                                placeholder='Thời gian dự kiến kết thúc'
                                name='taskEnd'
                                value={taskEnd}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                    </div>
                    <Button style={{float:'right',width:'5%', marginLeft:'5px'}} >
                      <Link to={`/tasks/add/0/project/${id}`}>
                        <PlusSquareOutlined />
                    </Link>  
                    </Button>
                    
                    <Button className='btn-info btn btn-block' style={{float:'right',width:'5%', marginLeft:'5px'}}><FilterOutlined /></Button>
                    <Button className='btn-danger btn btn-block' onClick={(e) => onRefresh(e)} style={{float:'right',width:'5%',marginLeft:'5px', marginBottom:'10px'}}><ReloadOutlined /></Button>
                </form>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <div className='card'>
                        <div className='card__body'>
                            <Table
                                limit='10'
                                headData={taskTableHead} 
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={tasks}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tasks;
