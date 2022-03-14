import {React, useContext, useEffect, useState} from 'react'
import axios from "axios";
import Table from '../../../components/table/Table'
import {useNavigate, useParams } from "react-router-dom";
import 'boxicons';
import Genders from '../../../assets/json/gender.json'
import Spinner from '../../../components/spinner/Spinner';
import { message, Popconfirm, Button, Form, Input,Select, Row, Col } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import Card from '../../../components/card/Card'
import CreateAccount from '../account/CreateAccount';
const { Option } = Select;

const projectTableHead = [
    ['STT', 'id', false, 'number'],
    ['Username', 'username', true, 'string'],
    ['Email', 'email', true, 'string'],
    ['Giới tính', 'gender', false, 'string'],
    ['Ngày tạo', 'created_at', 'date'],
    ['Action', 'action', false, 'none']
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const Members = () => {
    const navigate = useNavigate();
    const {projectId} = useParams('id');
    const [countLastUserCreate, setCountLastUserCreate] = useState(0);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(false);
    
    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{++index}</td>
            <td>{item.username}</td>
            <td>{item.email}</td>
            <td>{Genders.filter(gender=>gender.value === item.gender)[0].label}</td>
            {console.log(Genders)}
            <td>{item.created_at}</td>
            <td>
                <CreateAccount user={item} />
                <Popconfirm
                    placement="topRight"
                    title="Bạn có chắc chắn muốn thành viên này?"
                    onConfirm={()=>confirmDeleteMember(parseInt(item.projectId), item.id)}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button icon={<DeleteOutlined color='red'/>}/>
                </Popconfirm>
            </td>
        </tr>
    );

    const confirmDeleteMember = async (projectId,id) => {
        axios.delete(`/api/users/delete/${id}`).then((response) => {
            if (response.data.code === 200) {
                setMembers(members.filter(member => member.id !== id))
                message.success(response.data.message);
            }
            else {
                message.error(response.data.message);
            }
        })
    };

    const onFinish = (values) => {
        let data =values;
        console.log(data);
        axios.post(`/api/members/add/${projectId}`, data).then(res=>{
            console.log(res);
            if(res.data.code === 200)
            {  
                message.success(res.data.message);
                setMembers([...members,res.data.data]);
                setLoading(false);
            }
            else if(res.data.code > 200)
            {
                message.error(res.data.message);
            }
        });
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        console.log(`http://localhost:8000/api/users`);
        axios.get(`/api/users`).then(res=> {
            console.log(res);
            if (res.data.code === 200) {
                setMembers(res.data.data);
                const now = new Date();
                const month = now.getMonth();
                console.log(month);
                const numberOfUserCreateInMonth = res.data.data.filter(item => (new Date(item.created_at)).getMonth() === month).length;
                setCountLastUserCreate(numberOfUserCreateInMonth);
                setLoading(false);
            }
            else {
                navigate('/login');
                console.log(res.data.message);
            }
        })
        // .catch(error=>navigate('/login'))
    },[projectId, navigate, setMembers]);
    
    if (loading) {
        return <Spinner/>
    }
    else
    return (
        <div>
            <div className='row'>
                <Card count={members.length} title="Số người dùng" icon="bx bxs-user-account"/>
                <Card count={countLastUserCreate} title="Tạo mới trong tháng" icon="bx bx-diamond"/>
            </div> 
            <CreateAccount create="false" title="Thêm người dùng"/>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                <Table
                                    limit='10'
                                    headData={projectTableHead} 
                                    renderHead={(item, index) => renderHead(item, index)}
                                    bodyData={members}
                                    renderBody={(item, index) => renderBody(item, index)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Members;
