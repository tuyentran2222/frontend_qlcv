import {React, useEffect, useState} from 'react'
import axios from "axios";
import swal from 'sweetalert';
import 'boxicons';
import Card from '../components/card/Card';
import Chart from 'react-apexcharts';
import Spinner from '../components/spinner/Spinner';

const Dashboard = () => {
    const [countProjects, setCountProjects] = useState('');
    const [countAssignedTasks, setCountAssignedTasks] = useState(0);
    const [countCreateTasks, setCountCreateTasks] = useState(0);
    const [onLoading, setOnLoading] = useState(true);
    const [status, setStatus]= useState([0,0,0,0]);
    const [status1, setStatus1]= useState([0,0]);
    const chartOptions1 = {
        options :{
            labels : ["Mới", "Đang thực hiện", "Đã hoàn thành", "Quá hạn"]
        },
        series: status,
        
    }

    const chartOptions2 = {
        options :{
            labels : ["Số dự án tạo", "Số dự án không phải do mình tạo"]
        },
        series: status1
        
    }

    useEffect(()=>{
        axios.get(`/api/status/projects`).then(res=>{
            if(res.data.code === 200)
            {
                setStatus(res.data.data[0]);
                setStatus1(res.data.data[1]);
            }
            else if(res.data.code > 200)
            {
                swal("Thất bại",res.data.message,"error");
            }
           
        });
        axios.get(`/api/count/projects`).then(res=>{
            if(res.data.code === 200)
            {
                setCountProjects(res.data.data.countProjects);
                setCountAssignedTasks(res.data.data.countAssigned);
                setCountCreateTasks(res.data.data.countCreate);
                setOnLoading(false);
            }
            else if(res.data.code > 200)
            {
                swal("Thất bại",res.data.message,"error");
            }
           
        });
    },[]);

    if (onLoading) return <Spinner/>;
    return (
        <>
        {console.log(status)}
            <div className='row' style={{marginTop:'30px'}}>
                    <Card count={countProjects} title="Tổng số dự án" icon='bx bxl-product-hunt'></Card>
                    <Card count={countAssignedTasks} title="Công việc được giao" icon='bx bx-task'></Card>
                    <Card count={countCreateTasks} title="Công việc đã tạo" icon='bx bx-task'></Card>

            </div>
            <div className='row'>
                <div className="col-md-6 col-sm-12" style={{margin:'auto 0'}}>
                    <Chart options={chartOptions1.options} series={chartOptions1.series} labels={chartOptions1.labels} type="pie" width="450" ></Chart>
                    <div className="text-center">Dự án</div>
                </div>
                <div className="col-md-6 col-sm-12" style={{margin:'auto 0'}}>
                    <Chart options={chartOptions2.options} series={chartOptions2.series} labels={chartOptions2.labels} type="pie" width="550" ></Chart>
                    <div className="text-center">Dự án</div>
                </div>
            </div>
        </>

    )
}

export default Dashboard;
