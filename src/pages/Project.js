import {React, useContext, useEffect, useState} from 'react'
import axios from "axios";
import Table from '../components/table/Table'
import { Link, useNavigate } from "react-router-dom";
import 'boxicons';
import { AppContext } from '../components/context/Context';
import Spinner from '../components/spinner/Spinner';
import {FilterOutlined,DeleteOutlined, UserOutlined, MenuFoldOutlined, EditOutlined, PlusSquareOutlined, ReloadOutlined}  from '@ant-design/icons';
import { Button, Popconfirm, message} from 'antd';

const projectTableHead = [
    ['STT', 'id', false, 'number'],
    ['Tên dự án', 'projectName', true, 'string'],
    ['Mã dự án','projectCode', true, 'string'],
    ['Thời gian bắt đầu', 'projectStart' , true, 'date'],
    ['Trạng thái', 'status' , false, 'number'],
    ['Đối tác', 'partner', true , 'string'],
    ['Vai trò', 'role', false, 'string'],
    ['Action', 'action', false, 'none']
];

const renderHead = (item, index) => <th key={index}>{item}</th>

const Project = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useContext(AppContext).projects;
    const [initProjects, setInitProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState({
        projectName: "",
        projectCode: "",
        partner: "",  
        status: "",
        projectStart: "",
        projectEnd: ""
    });
    const status1 = [
        'Chọn trạng thái','Mới', "Đang thực hiện", "Đã thực hiện", "Hoàn thành"
    ];
    const { projectName, projectCode, partner, status, projectStart, projectEnd } = project;
    const onInputChange = e => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const confirmDeleteProject = async id => {
        axios.delete(`/api/projects/delete/${id}`).then((response) => {
            if (response.data.code === 200) {
                message.success(response.data.message);
                setProjects(projects.filter(project=>project.id !== id));
            }
            else {
                message.error(response.data.message);
            }
        })
    };
    
    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{index+1}</td>
            <td>{item.projectName}</td>
            <td>{item.projectCode}</td>
            <td>{item.projectStart}</td>
            <td>{status1[item.status]}</td>
            <td>{item.partner}</td>
            <td>{item.role}</td>
            <td>
                {
                    item.role !== "Owner"? '' :
                    <Link to={`/projects/edit/${item.id}`}>
                        <Button type='text' icon={<EditOutlined />}></Button>
                    </Link>
                }
                {
                    item.role !== "Owner" ? '' : 
                    <Popconfirm
                    icon={<DeleteOutlined/>}
                        placement="topRight"
                        title="Bạn có chắc chắn muốn xóa dự án này?"
                        onConfirm={()=>confirmDeleteProject(item.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type='text'><DeleteOutlined size='small'/></Button>
                    </Popconfirm>
                }
              
                <Link to={`/members/${item.id}`}>
                    <Button type='text' icon={<UserOutlined />} ></Button>
                </Link>
                
                <Link to={`/project/${item.id}/tasks/`}>
                    <Button type='text' icon={<MenuFoldOutlined/>}></Button>
                </Link>
                
            </td>
        </tr>
    );

    const onRefresh = (e) => {
        e.preventDefault();
        setProjects(initProjects);
        setProject({
            projectName: "",
            projectCode: "",
            partner: "",  
            status: "0",
            projectStart: "",
            projectEnd: ""
        });
    }
    

    const onFilter =  e => {
        e.preventDefault();
        let pStart, pEnd;
        pStart = (projectStart === "") ? "1970-01-01" : projectStart; 
        pEnd = (projectEnd === "") ? "2970-01-01" : projectEnd;
        let filterData = initProjects
        .filter (d=>d.projectName.toLowerCase().includes(projectName.toLowerCase()))
        .filter(d=> d.projectCode.toLowerCase().includes(projectCode.toLowerCase()))
        .filter(d=>d.partner.toLowerCase().includes(partner.toLowerCase()))
        .filter(d=>new Date(d.projectStart) > new Date(pStart))
        .filter(d=>new Date(d.projectEnd) < new Date(pEnd));
        if (status > 0)
        filterData =filterData.filter(d => Number(d.status) === Number(status));
        setProjects(filterData);
        setLoading(false);        
    };


    useEffect(() => {
        axios.get("/api/projects").then(res=> {
            if (res.data.code === 200) {  
                setInitProjects(res.data.data);
                setProjects(res.data.data);
                setLoading(false);
            }
        }).catch((error) => {
            console.log(error);
            // navigate('/login');
        })
    }, [navigate, setProjects]);

    if (loading) return <Spinner/>
    return (
        <>
            <div className="row filter-bar" style={{margin:"10px 0px 10px 0px"}}>
                <form onSubmit={e => onFilter(e)} className=" filter-table col-12">
                    
                    <div className="input-group">
                        <div className='col-4 input-form'>
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
                        <div className='col-4 input-form'>
                            <input
                                id="projectCode"
                                type="text"
                                className="form-control"
                                placeholder="Mã dự án"
                                name="projectCode"
                                value={projectCode}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <div className='col-4 input-form'>
                            <input
                                id = "partner"
                                type="text"
                                className="col-4 form-control"
                                placeholder="Đối tác"
                                name="partner"
                                value={partner}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                    </div>
                    
                    <div className='input-group'>
                        <div className='col-4 input-form'>
                            <select name="status" className="col-4 form-control" value={status} onChange={e => onInputChange(e)}>
                                <option value="0" checked>Chọn trạng thái</option>
                                <option value="1" checked>Mới</option>
                                <option value="2">Đang thực hiện</option>
                                <option value="3">Đã thực hiện</option>
                                <option value="4">Hoàn thành</option>
                            </select>
                        </div>
                        <div className='col-4 input-form'>
                            <input
                                id="projectStart"
                                type="date"
                                className="col-4 form-control"
                                placeholder="Thời gian bắt đầu"
                                name="projectStart"
                                value={projectStart}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <div className='col-4 input-form'>
                            <input
                                id="projectEnd"
                                type="date"
                                className="col-4 form-control"
                                placeholder="Thời gian dự kiến kết thúc"
                                name="projectEnd"
                                value={projectEnd}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                    </div>
                    <Button style={{float:'right',width:'5%', marginLeft:'5px'}} >
                      <Link to={`/projects/add`}>
                        <PlusSquareOutlined />
                    </Link>  
                    </Button>
                    
                    <Button  onClick={(e) => onFilter(e)} style={{float:'right',width:'5%', marginLeft:'5px'}}><FilterOutlined /></Button>
                    <Button  onClick={(e) => onRefresh(e)} style={{float:'right',width:'5%',marginLeft:'5px', marginBottom:'10px'}}><ReloadOutlined /></Button>
                </form>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={projectTableHead} 
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={projects}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Project;
