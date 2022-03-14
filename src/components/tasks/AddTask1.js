import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate, Link, useParams } from "react-router-dom";
import swal from 'sweetalert'
import SideBar from "../sidebar/SideBar";
import TopNav from "../topnav/TopNav";
import Multiselect from 'multiselect-react-dropdown';
const AddTask = () => {

  const {parent_id, project_id} =  useParams();
  let navigate = useNavigate();
  const [options, setOptions] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [projectNames, setProjectNames] = useState([]);
  const [members, setMembers] = useState([]);
  const [task, setTask] = useState({
    taskName: "",
    taskCode: "",
    taskDescription: "",  
    status: "",
    taskStart: "",
    taskEnd: "",
    levelCompletion : 0,
    projectCode: project_id,
    priority: 0,
    projectName: '',
    taskPersonId: 0
    });
  const { taskName, taskCode, taskDescription, status, taskStart, taskEnd, levelCompletion, projectCode, projectName, priority, taskPersonId } = task;
  const onInputChange = e => {
    setTask({ ...task, [e.target.name]: e.target.value });
    console.log(e.target.value)
    console.log(e.target.name)
    if (e.target.name === 'projectCode') {
      axios.get(` http://localhost:8000//api/members/${e.target.value}`, config).then(res=> {
        if (res.data.code === 200) {
            setMembers(res.data.data);
        }
        if (res.data.code === 500) {
            navigate('/login');
        }
        console.log(res.data.data);
    })
    }
  };

  const onSelect = (e) =>{console.log(e);
    let select = e;
    let taskPerson = "";
    let size = select.length;
    for (let i=0; i<size;i++) {
      if (i === size-1)  taskPerson = taskPerson + select[i].id
      else
      taskPerson = taskPerson + select[i].id + ","
    }
    setTask({ ...task, "taskPersonIds" : taskPerson });
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
  
  const config ={
    headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
    }
  }

  const onSubmit = async e => {
    e.preventDefault();
    let pid = 0;
    if (parent_id) pid = parent_id;
    console.log(task)
    axios.post(` http://localhost:8000//api/tasks/create/${pid}/projects/${project_id}`, task, config).then(res => {
      console.log(res);
      if(res.data.code === 200)
      {
  
        swal("Success!",res.data.message,"success");
        navigate(-1);
      }
      else if(res.data.code > 200)
      {
        swal("Error", res.data.message, "error")
      }
    })

  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/members/memberInfo/${project_id}`,config).then( res => {
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
    axios.get(` http://localhost:8000//api/members/${project_id}`, config).then(res=> {
        if (res.data.code === 200) {
            setMembers(res.data.data);
        }
        if (res.data.code === 500) {
            navigate('/login');
        }
        console.log(res.data.data);
      }
    )
    axios.get(" http://localhost:8000//api/getAllProjects", config).then(res=> {
        if (res.data.code === 200) {
            setProjectNames(res.data.data);
            setLoading(false);
        }
        if (res.data.code === 500) {
            navigate('/login');
        }
        console.log(res.data.data);
    });
}, []);
  return (
    <div className='layout'>
      <SideBar/>
      <div className="layout__content">
          <TopNav/>
          <div className="layout__content-main">
              <div class="header-content">
                  <h4 className="page-header">
                    THÊM CÔNG VIỆC
                  </h4>
              </div>
              <div className="row container-fluid">
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
                        className="form-control"
                        placeholder="Mô tả chi tiết công việc"
                        name="taskDescription"
                        rows={4}
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
                                type="datetime-local"
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
                                type="datetime-local"
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
                        <select class="form-select" id="projectCode" name="projectCode" value={projectCode} onChange={e => onInputChange(e)} aria-label="Default select example">
                          {projectNames.map((element,index) => {
                            return <option value={element.projectId}>{element.projectName}</option>;
                          })}
                          {console.log(projectNames)}
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
                        {/* <select class="form-select" id="taskPersonId" name="taskPersonId" value={taskPersonId} onChange={e => onInputChange(e)} aria-label="Default select example">
                          {members.map((element,index) => {
                            return <option value={element.id}>{element.username}</option>;
                          })}
                          {console.log(projectNames)}
                        </select> */}
                        <Multiselect
                          options={options} // Options to display in the dropdown
                          onSelect={(e) => onSelect(e)} // Function will trigger on select event
                          onRemove={(e) =>onRemove(e)} // Function will trigger on remove event
                          displayValue="name" // Property name to display in the dropdown options
                        />

                    </div>
                    <button className="btn btn-primary btn-block">Thêm công việc</button>
                    <Link className="btn btn-danger btn-block" to={'/tasks'}>Hủy</Link>
                  </form>
                </div>
              </div>
          </div>
        </div>
      </div>
  );
};

export default AddTask;