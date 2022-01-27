import React,{useContext, useState} from 'react'
import { Link , useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from "reactstrap"; 
import Chart from 'react-apexcharts';
import axios from "axios";
import "../Login/login.css";
import { AppContext } from '../context/Context';
import { message } from 'antd';
const Login = () => {
    const [user, setUser] = useContext(AppContext).user;
    const [dataForm,setDataForm] = useState({"email" : "","password" : ""});
    const [errors, setErrors] = useState({"emailError": '', 'passwordError': ''});
    let navigate  = useNavigate();
    const chartOptions = {
        options :{
            labels : ["Mới", "Hoàn thành", "Quá hạn", "Chưa giao", "Đang thực hiện"]
        },
        series: [10,25,3,22,12]
    }

    const onLogin = (e) => {
        if (dataForm.email === "" && dataForm.password === "" ) {
            setErrors({
                "emailError": "Email không được bỏ trống",
                "passwordError": "Mật khẩu không được bỏ trống"
            });
        }
        if (dataForm.email === "" && dataForm.password !== "" ) {
            setErrors({
                "emailError": "Email không được bỏ trống",
                "passwordError": ""
            });
        }
        if (dataForm.email !== "" && dataForm.password === "" ) {
            setErrors({
                "emailError": "",
                "passwordError": "Mật khẩu không được bỏ trống"
            });
        }
        
        if(dataForm.email !== "" && dataForm.password !== ""){
            if (dataForm.password.length < 6) {
                setErrors({
                    ...errors,
                    "passwordError": "Mật khẩu dài tối thiểu 6 kí tự"
                });
            }
            else {
                setErrors({"emailError": "" , "passwordError": ""});
                const user = { 'email' :dataForm.email, 'password' : dataForm.password };
                axios.post('http://127.0.0.1:8000/api/users/login', user).then((response) => {
                    if (response.data.code === 200) {
                        axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.data.token;
                        localStorage.setItem('token',response.data.data.token);
                        localStorage.setItem('user', JSON.stringify(response.data.data.user));  
                        message.success('Đăng nhập thành công');
                        setUser(response.data.data);
                        navigate('/dashboard');
                    }
                    else {
                        message.error('Đăng nhập thất bại');
                    }
                })

            }
            
        }
    }
     
    return (
        <div className="col-md-9 col-sm-12" style={{margin:'0 auto'}}>
            <h2 className="text-center" style={{paddingTop:'60px', fontSize:'25px',fontWeight:'bolder'}}>QUẢN LÝ CÔNG VIỆC</h2>
            <div className="row">
                <div className="col-md-6  col-sm-12 login-chart">
                    <Chart options={chartOptions.options} series={chartOptions.series} labels={chartOptions.labels} type="pie" width="450" ></Chart>
                </div>
                <div className="col-md-6  col-sm-12">
                    <Form className="form-login container-fluid col-md-12">
                        <h2 className="text-center" style={{marginTop:'60px', fontSize:'25px',fontWeight:'bolder'}}>ĐĂNG NHẬP</h2>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                            type="email"
                            name="email"
                            placeholder="Nhập email"
                            value={dataForm.email}
                            onChange={(e)=>setDataForm({...dataForm,"email":e.target.value})}
                            />
                            <span className="text-danger">{errors.emailError}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Mật khẩu</Label>
                            <Input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={dataForm.password}
                            onChange={(e)=>setDataForm({...dataForm,"password":e.target.value})}
                            />
                            <span className="text-danger">{errors.passwordError}</span>
                        </FormGroup>
                        <Button
                            className="text-center col-md-12 btn-md btn-login"
                            color="primary"
                            onClick ={(event)=>onLogin(event)}
                        >Đăng nhập</Button>
                        <div className="form-login-link">
                            <div>
                                <Link to="#" className="form-login-link-item">Quên mật khẩu?</Link>
                            </div>
                            <div>
                                <Link className="form-login-link-item" to="/register">Đăng ký</Link>
                            </div>
                        </div>
                        
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login;
 

