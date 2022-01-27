import React, {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams, Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import TopNav from '../topnav/TopNav';
import SideBar from '../sidebar/SideBar';
import Spinner from '../spinner/Spinner';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import { AppContext } from "../context/Context";
import Table from '../table/Table';
import Multiselect from 'multiselect-react-dropdown';

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
  ['Mức độ hoàn thành(%)', 'levelCompletion', true , 'number'],
  ['Mức độ ưu tiên', 'priority', false, 'string'],
  ['Action', 'action', false, 'none']
];

const config ={
  headers: {
      Authorization: "Bearer " + localStorage.getItem('token')
  }
}

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
  <tr key={index}>
      <td>{index+1}</td>
      <td>{item.taskName}</td>
      <td>{item.taskCode}</td>
      <td>{item.taskStart}</td>
      <td>{status[item.status+1]}</td>
      <td>{item.levelCompletion}</td>
      <td>{priority[item.priority]}</td>
      
      <td style={{display:'flex', flexDirection:'row'}}>
          {item.role === "Thành viên"?'' :<Link className="btn mr-2" to={`/tasks/edit/${item.id}`}>
              <i className='bx bx-edit'></i>
          </Link>
          }
          {item.role === "Thành viên"?'' : <button className="btn" onClick={() => deleteTask(item.id)}>
              <i className='bx bx-x-circle' style={{color:'#ff0000'}}  ></i>
          </button>}
          
      </td>
  </tr>
);

const deleteTask = async id => {
  swal("Bạn có chắc chắn muốn xóa dự án này?", {
      buttons: {
        cancel: "Hủy",
        catch: {
          text: "Đồng ý",
          value: "catch",
        },
      //   defeat: true,
      },
  })
  .then((value) => {
      switch (value) {
          case "cancel":
              swal("Error","Hủy thành công!","error");
              break;
      
          case "catch":
          {
              axios.delete(`http://localhost:8000/api/tasks/delete/${id}`,config).then((response) => {
                  if (response.data.code === 200) {
                      swal("Success",response.data.message,"success");
                      // const navigate = useNavigate();
                      // navigate('/tasks')
                  }
                  else {
                      swal("Error!",response.data.message,"error");
                  }
              })
              .catch((error) => {
                      
              });
              break;
          }
          default:
              swal('Error', "Đã có lỗi xảy ra", 'error')
  }
  });
};


function EditTask(props) {
    let navigate = useNavigate();
    const [options, setOptions] = useState([{name: 'Option 1️⃣', id: 1},{name: 'Option 2️⃣', id: 2}]);
    const { projectId ,id } = useParams();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useContext(AppContext).comments;
    const [childTasks, setChildTasks] = useState([]);
    const [projectNames, setProjectNames] = useState([]);
    const [members, setMembers] = useState([]);
    const [task, setTask] = useState({
      taskName: "",
      taskCode: "",
      taskDescription: "",  
      status: 0,
      taskStart: "",
      taskEnd: "",
      levelCompletion : 0,
      projectCode: "",
      priority: 0,
      projectName: '',
      taskPersonIds: ""
    });
    const { taskName, taskCode, taskDescription, status, taskStart, taskEnd, levelCompletion, projectCode, projectName, priority } = task;
   
    const onInputChange = e => {
      setTask({ ...task, [e.target.name]: e.target.value });
      
      if (e.target.name === 'projectCode') {
        axios.get(`http://localhost:8000/api/members/${e.target.value}`, config).then(res=> {
          if (res.data.code === 200) {
              setMembers(res.data.data);
          }
          if (res.data.code === 500) {
              navigate('/login');
          }
    
      })
      }
    };

    const config ={
        headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    useEffect(() => {
        const taskId = id;
        axios.get(`http://127.0.0.1:8000/api/members/memberInfo/${projectId}`,config).then( res => {
          if(res.data.code === 200)
          {
             console.log(res.data.data)
             setOptions(res.data.data)
          }
          else
          {
              swal("Error",res.data.message,"error");
              navigate("/tasks");
          }
          
        });
        axios.get(`http://127.0.0.1:8000/api/tasks/edit/${taskId}`,config).then( res => {
          if(res.data.code === 200)
          {
              setTask(res.data.data);
              setComments(res.data.comments);
              setChildTasks(res.data.childTasks);
              setLoading(false);
          }
          else
          {
              swal("Error",res.data.message,"error");
              navigate("/tasks");
          }
          
        });

        axios.get("http://localhost:8000/api/getAllProjects", config).then(res=> {
        if (res.data.code === 200) {
            setProjectNames(res.data.data);
            setLoading(false);
        }
        if (res.data.code === 500) {
            navigate('/login');
        }
        
        axios.get(`http://localhost:8000/api/members/${projectCode}`, config).then(res=> {
          console.log(projectCode)
          if (res.data.code === 200) {
              setMembers(res.data.data);
              setLoading(false);
          }
          else {
              console.log("Error");
          }
      })
    });

    }, [navigate]);
    
    const onSubmit = (e) => {
      console.log(task)
        e.preventDefault();
        axios.patch(`http://127.0.0.1:8000/api/tasks/update/${id}`, task,config).then(res=>{
          
            if(res.data.code === 200)
            {
              swal("Success",res.data.message,"success");
              navigate('/tasks');
            }
            else if(res.data.code === 422)
            {
              swal("All fields are mandetory","","error");
            }
            else if(res.data.code === 404)
            {
              swal("Error",res.data.message,"error");
              navigate('/tasks');
            }
        });
    }
    const onSelect = (e) =>{
      let select = e;
      let taskPerson = "";
      let size = select.length;
      for (let i=0; i<size;i++) {
        if (i === size-1)  taskPerson = taskPerson + select[i].id
        else
        taskPerson = taskPerson + select[i].id + ","
      }
      setTask({ ...task, "taskPersonIds": taskPerson });
      console.log(task)
    }
    
    const onRemove = (e) => {
      let select = e;
      let taskPerson = "";
      let size = select.length;
      for (let i=0; i<size;i++) {
        if (i === size-1)  taskPerson = taskPerson + select[i].id
        else
        taskPerson = taskPerson + select[i].id + ","
      }
      setTask({ ...task, "taskPersonIds": taskPerson });
      console.log(task)
    }

  if (loading) {
    return <Spinner/>     
  }
  return (
    <div className='layout'>
      <SideBar/>
      <div className="layout__content">
          <TopNav/>
          <div className="layout__content-main">
              <div className="header-content">
                  <h4 className="page-header">
                    Xem chi tiết công việc
                  </h4>
              </div>
              <div className="row">
                <div className="w-80 mx-auto p-5">
                  <form onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                      <label htmlFor="taskName" className="col-form-label">
                        Tên công việc <span className="text-danger">*</span>
                      </label>
                      <input
                        id="taskName"
                        type="text"
                        className="form-control"
                        placeholder="Tên công việc"
                        name="taskName"
                        value={taskName}
                        onChange={e => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="taskCode" className="col-form-label">
                        Mã công việc <span className="text-danger">*</span>
                      </label>
                      <input
                        id = "taskCode"
                        type="text"
                        className="form-control"
                        placeholder="Mã công việc"
                        name="taskCode"
                        value={taskCode}
                        onChange={e => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="taskDescription" className="col-form-label">
                        Mô tả công việc <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id = "taskDescription"
                        type="text"
                        rows={4}
                        className="form-control"
                        placeholder="Mô tả chi tiết công việc"
                        name="taskDescription"
                        value={taskDescription}
                        onChange={e => onInputChange(e)}
                      />
                    </div>

                    <div className='input-group'>
                        <div className="form-group col-6 input-inline-left" >
                            <label htmlFor="taskStart" className="col-form-label">
                                Thời gian bắt đầu <span className="text-danger">*</span>
                            </label>
                            <input
                                id="taskStart"
                                type="datetime"
                                className="form-control"
                                placeholder="Thời gian bắt đầu"
                                name="taskStart"
                                value={taskStart}
                                onChange={e => onInputChange(e)}
                            />
                        </div>

                        <div className="form-group col-6 input-inline-right">
                            <label htmlFor="taskEnd" className="col-form-label">
                                Thời gian dự kiến kết thúc<span className="text-danger">*</span>
                            </label>
                            <input
                                id="taskEnd"
                                type="date-time"
                                className="form-control"
                                placeholder="Thời gian dự kiến kết thúc"
                                name="taskEnd"
                                value={taskEnd}
                                onChange={e => onInputChange(e)}
                            />
                        </div>

                    </div>

                    <div className='input-group'>
                        <div className="form-group col-6 input-inline-left">
                            <label htmlFor="status" className="col-form-label">
                                Trạng thái <span className="text-danger">*</span>
                            </label>
                            <select name="status" className="form-control" value={status} onChange={e => onInputChange(e)}>
                                <option value="1">Mới</option>
                                <option value="2">Đang thực hiện</option>
                                <option value="3">Đã thực hiện</option>
                                <option value="4">Hoàn thành</option>
                                <option value="5">Quá hạn</option>
                            </select>
                        </div>
                        <div className="form-group col-6 input-inline-right">
                            <label htmlFor="levelCompletion" className="col-form-label">
                                Mức độ hoàn thành(%)<span className="text-danger">*</span>
                            </label>
                            <input
                                id="levelCompletion"
                                type="number" min="0" max="100"
                                className="form-control"
                                placeholder="Mức độ hoàn thành(%)"
                                name="levelCompletion"
                                value={levelCompletion}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="projectCode" className="col-form-label">
                            Dự án<span className="text-danger">*</span>
                        </label>
                        <select className="form-select" id="projectCode" name="projectCode" value={projectCode}  onChange={e => onInputChange(e)} aria-label="Default select example">
                          {projectNames.map((element) => {
                            return element.projectId===task.projectId ? <option value={element.projectId} key={element.projectId} selected>{element.projectName}</option> :
                            <option value={element.projectId} key={element.projectId} >{element.projectName}</option>;
                            
                          })}
                          {console.log(task.projectId)}
                        </select>
                    </div>
                        
                    <div className="form-group">
                      <label htmlFor="priority" className="col-form-label">
                       Mức độ ưu tiên <span className="text-danger">*</span>
                      </label>
                      <select name="priority" className="form-control" value={priority} onChange={e => onInputChange(e)}>
                        <option value="1">Cao</option>
                        <option value="2">Trung bình</option>
                        <option value="3">Thấp</option>
                      </select>
                    </div>
                  
                    <div className="form-group">
                        <label htmlFor="taskPersonId" className="col-form-label">
                            Người phụ trách<span className="text-danger">*</span>
                        </label>
                        <Multiselect
                          options={options} // Options to display in the dropdown
                          onSelect={(e) => onSelect(e)} // Function will trigger on select event
                          onRemove={(e) =>onRemove(e)} // Function will trigger on remove event
                          displayValue="name" // Property name to display in the dropdown options
                        />
                        {/* <label htmlFor="taskPersonId" className="col-form-label">
                            Người phụ trách<span className="text-danger">*</span>
                        </label>
                        <select className="form-select" id="taskPersonId" name="taskPersonId" value={projectName} onChange={e => onInputChange(e)} aria-label="Default select example">
                          {members.map((element,index) => {
                            return <option value={element.id}>{element.username}</option>;
                          })}
                        </select> */}

                    </div>
                    
                    <button className="btn btn-primary" style={{marginTop:'15px'}}>Cập nhật</button>
                  </form>
                </div>
              </div>
              <div className="child-tasks" style={{width:'92%', margin:'auto'}}>
                  <h6>Công việc con cần thực hiện</h6>
                  <div className="row">
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
                            {console.log(task)}
                  <Link className="btn btn-primary" to={'/tasks/add/'+ id + '/project/'+ task.projectId}>Thêm công việc con</Link>
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
            </div>
              
      </div>
    </div>
    
  );
};

export default EditTask;