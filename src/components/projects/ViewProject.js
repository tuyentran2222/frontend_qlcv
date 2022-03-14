import React, {useState, useEffect} from 'react';
import {useNavigate, useParams, Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import TopNav from '../topnav/TopNav';
import SideBar from '../sidebar/SideBar';

import Spinner from '../spinner/Spinner';
function ViewProject(props) {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({});

  const { projectName, projectCode, partner, status, projectStart, projectEnd } = project;

  const config ={
    headers: {
      Authorization: "Bearer " + localStorage.getItem('token')
    }
  }

  const { id } = useParams();
  useEffect(() => {
      const projectId = id;
      axios.get(`https://qlvcbackend.herokuapp.com/api/projects/edit/${projectId}`,config).then( res => {
        if(res.data.code === 200)
        {
          setProject(res.data.project);
          setLoading(false);
        }
        else if(res.data.code === 404)
        {
          swal("Error",res.data.status,"error");
          navigate("/projects");
        }
      });

    }, [navigate]);

    const onInputChange = (e) => {
        setProject({...project, [e.target.name]: e.target.value });
    }
    
    const onSubmit = (e) => {
        e.preventDefault();
        axios.put(`https://qlvcbackend.herokuapp.com/api/projects/update/${id}`, project,config).then(res=>{
          
            if(res.data.code === 200)
            {
              swal("Success",res.data.message,"success");
              navigate('/projects');
            }
            else if(res.data.code === 422)
            {
              swal("All fields are mandetory","","error");
            }
            else if(res.data.code === 404)
            {
              swal("Error",res.data.message,"error");
              navigate('/projects');
            }
        });
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
              <div class="header-content">
                  <h2 className="page-header">
                  Xem chi tiết dự án
                  </h2>
              </div>
              <div className="row">
                <div className="w-80 mx-auto shadow p-5">
                  <form onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                      <label htmlFor="projectName" className="col-form-label">
                        Tên dự án <span className="text-danger">*</span>
                      </label>
                      <input
                        id="projectName"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Tên dự án"
                        name="projectName"
                        value={projectName}
                        onChange={e => onInputChange(e)}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="projectCode" className="col-form-label">
                        Mã dự án <span className="text-danger">*</span>
                      </label>
                      <input
                        id = "projectCode"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter Your Username"
                        name="projectCode"
                        value={projectCode}
                        onChange={e => onInputChange(e)}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="partner" className="col-form-label">
                        Đối tác <span className="text-danger">*</span>
                      </label>
                      <input
                        id = "partner"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Đối tác"
                        name="partner"
                        value={partner}
                        onChange={e => onInputChange(e)}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="status" className="col-form-label">
                        Trạng thái <span className="text-danger">*</span>
                      </label>
                      <select name="status" className="form-control" value={status} onChange={e => onInputChange(e) } disabled>
                        <option value="1">Mới</option>
                        <option value="2">Đang thực hiện</option>
                        <option value="3">Đã thực hiện</option>
                        <option value="4">Hoàn thành</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="projectStart" className="col-form-label">
                        Thời gian bắt đầu <span className="text-danger">*</span>
                      </label>
                      <input
                        id="projectStart"
                        type="date"
                        className="form-control form-control-lg"
                        placeholder="Thời gian bắt đầu"
                        name="projectStart"
                        value={projectStart}
                        onChange={e => onInputChange(e)}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="projectEnd" className="col-form-label">
                        Thời gian dự kiến kết thúc<span className="text-danger">*</span>
                      </label>
                      <input
                        id="projectEnd"
                        type="date"
                        className="form-control form-control-lg"
                        placeholder="Thời gian dự kiến kết thúc"
                        name="projectEnd"
                        value={projectEnd}
                        onChange={e => onInputChange(e)}
                        disabled
                      />
                    </div>
                  </form>
                  <Link className="btn btn-danger btn-block" style={{marginTop:'20px'}} to="/projects">Quay lại</Link>
                </div>
              </div>
            </div>
      </div>
    </div>
    
  );
};

export default ViewProject;