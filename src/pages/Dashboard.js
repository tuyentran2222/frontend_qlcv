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
    
    const chartOptions = {
        options :{
            labels : ["Mới", "Hoàn thành", "Quá hạn", "Chưa giao", "Đang thực hiện"]
        },
        series: [10,25,3,22,12],
        
    }
    useEffect(()=>{
        axios.get(`/api/count/projects`).then(res=>{
            if(res.data.code === 200)
            {  
                setCountProjects(res.data.data);
            }
            else if(res.data.code > 200)
            {
                swal("Thất bại",res.data.message,"error");
            }
           
        });
        axios.get(`api/tasks/getCount`).then(res=>{
            if(res.data.code === 200)
            {  
                setCountAssignedTasks(res.data.countAssigned);
                setCountCreateTasks(res.data.countCreate)
                setOnLoading(false);
            }
            else if(res.data.code > 200)
            {
                swal("Thất bại",res.data.message,"error");
            }
           
        });
    });

    if (onLoading) return <Spinner/>;
    return (
        <>
            <div className='row' style={{marginTop:'30px'}}>
                <div className='col-3'>
                    <Card count={countProjects} title="Tổng số dự án" icon='bx bxl-product-hunt'></Card>
                </div>
                <div className='col-3'>
                    <Card count={countAssignedTasks} title="Công việc được giao" icon='bx bx-task'></Card>
                </div>
                <div className='col-3'>
                    <Card count={countCreateTasks} title="Công việc đã tạo" icon='bx bx-task'></Card>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-6 col-sm-12" style={{margin:'auto 0'}}>
                    <Chart options={chartOptions.options} series={chartOptions.series} labels={chartOptions.labels} type="pie" width="450" ></Chart>
                    <div className="text-center">Công việc tạo</div>
                </div>
                <div className="col-md-6 col-sm-12" style={{margin:'auto 0'}}>
                    <Chart options={chartOptions.options} series={chartOptions.series} labels={chartOptions.labels} type="pie" width="450" ></Chart>
                    <div className="text-center">Công việc mình được giao</div>
                </div>
            </div>
        </>

    )
}

export default Dashboard;
