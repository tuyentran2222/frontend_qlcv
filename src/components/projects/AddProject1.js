import React, { useState } from "react";
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom";
import swal from 'sweetalert'
import SideBar from "../sidebar/SideBar";
import TopNav from "../topnav/TopNav";
const AddProject = () => {
  let navigate = useNavigate();
  const [project, setProject] = useState({
    projectName: "",
    projectCode: "",
    partner: "",  
    status: 0,
    projectStart: "",
    projectEnd: ""
  });

  const { projectName, projectCode, partner, status, projectStart, projectEnd } = project;
  const onInputChange = e => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };
  const config ={
    headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
    }
  }

  const onSubmit = async e => {
    e.preventDefault();console.log(project);
    axios.post(' https://qlvcbackend.herokuapp.com//api/create', project, config).then(res => {
      console.log(res);
      if(res.data.code === 200)
      {
        swal("Success!",res.data.message,"success");
        navigate("/projects");
      }
      else if(res.data.code > 200)
      {
        swal("Error", res.data.message, "error")
      }
    })

  };
  return (
    <div className='layout'>
      <SideBar/>
      <div className="layout__content">
          <TopNav/>
          <div className="layout__content-main">
              <div class="header-content">
                  <h2 className="page-header">
                    Thêm dự án
                  </h2>
              </div>
              <div className="row container-fluid">
                <div className="w-80 mx-auto p-5">
                  <form onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                      <label htmlFor="projectName" className="col-form-label">
                        Tên dự án <span className="text-danger">*</span>
                      </label>
                      
                        <input
                          id="projectName"
                          type="text"
                          className="form-control"
                          placeholder="Tên dự án"
                          name="projectName"
                          value={projectName}
                          onChange={e => onInputChange(e)}
                        />
                      
                      
                    </div>
                    <div className="form-group">
                      <label htmlFor="projectCode" className="col-form-label">
                        Mã dự án <span className="text-danger">*</span>
                      </label>
                      <input
                        id = "projectCode"
                        type="text"
                        className="form-control "
                        placeholder="Mã dự án"
                        name="projectCode"
                        value={projectCode}
                        onChange={e => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="partner" className="col-form-label">
                        Đối tác <span className="text-danger">*</span>
                      </label>
                      <input
                        id = "partner"
                        type="text"
                        className="form-control "
                        placeholder="Đối tác"
                        name="partner"
                        value={partner}
                        onChange={e => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status" className="col-form-label">
                        Trạng thái <span className="text-danger">*</span>
                      </label>
                      <select name="status" className="form-control" onChange={e => onInputChange(e)}>
                        <option value="1" checked>Mới</option>
                        <option value="2">Đang thực hiện</option>
                        <option value="3">Đã thực hiện</option>
                        <option value="4">Hoàn thành</option>
                      </select>
                    </div>
                    <div class="input-group">
                      <div className="form-group col-6" style={{padding: '0px 10px 20px 0px'}}>
                        <label htmlFor="projectStart" className="col-form-label">
                          Thời gian bắt đầu <span className="text-danger">*</span>
                        </label>
                        <input
                          id="projectStart"
                          type="date"
                          className="form-control "
                          placeholder="Thời gian bắt đầu"
                          name="projectStart"
                          value={projectStart}
                          onChange={e => onInputChange(e)}
                        />
                      </div>
                      <div className="form-group col-6" style={{padding: '0px 0px 20px 10px'}}>
                        <label htmlFor="projectEnd" className="col-form-label">
                          Thời gian dự kiến kết thúc<span className="text-danger">*</span>
                        </label>
                        <input
                          id="projectEnd"
                          type="date"
                          className="form-control "
                          placeholder="Thời gian dự kiến kết thúc"
                          name="projectEnd"
                          value={projectEnd}
                          onChange={e => onInputChange(e)}
                        />
                      </div>
                    </div>
                    
                    <button className="btn btn-primary btn-block">Thêm dự án</button>
                    <Link className="btn btn-danger btn-block" to={'/projects'}>Hủy</Link>
                  </form>
                </div>
              </div>
          </div>
        </div>
      </div>
  );
};

export default AddProject;