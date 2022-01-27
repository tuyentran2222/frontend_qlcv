import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./register.css";
import { message } from 'antd';
import ImgPrev from '../imageprev/ImgPrev';
import { AppContext } from '../context/Context';
import axios from 'axios';
import Genders from '../../assets/json/gender.json'
import {validateEmail} from '../validator/Validator'
const Register = () => {
    const [avatar,setAvatar] = useContext(AppContext).avatar;
    console.log(avatar)
    const [dataForm, setDataForm] = useState({
        "email": "",
        "username": "",
        "password": "",
        "confirm_password": "",
        "firstname" : "",
        'lastname' : "",
        'gender': 1,
        'avatar': avatar
    });
 
    /* check form register step */
    const [checkForm, setCheckForm] = useState({
        inputForm: false,
        uploadAvatar: false,
        btnRegister: false
    })

    useEffect(() => {
        
    }, []);

    /* check form state */
    const checkState = (value, event) => {
        event.preventDefault();
        console.log(dataForm);
        if (value === 'inputForm') {
            if (dataForm.name.length > 2
                && validateEmail(dataForm.email)
                && dataForm.password.length >= 8
                && (dataForm.password === dataForm.confirm_password)) {
                setCheckForm({ ...checkForm, inputForm: true })
            }
        }
        
        if (value === 'btnRegister') {
            console.log(avatar);
            const _formData = new FormData();
            _formData.append("username", dataForm.username);
            _formData.append("email", dataForm.email);
            _formData.append("password", dataForm.password);
            _formData.append("confirm_password",dataForm.confirm_password)
            _formData.append("avatar", avatar);
            _formData.append("gender", dataForm.gender );
            _formData.append("firstname",dataForm.firstname);
            _formData.append("lastname",dataForm.lastname);
            console.log(dataForm);
            axios.post('http://127.0.0.1:8000/api/users/register', _formData)
                .then(response =>{
                    console.log(response);
                    if(response.data.code === 200) message.success(response.data.message);
                    else message.error(response.data.message);
                });
 
        }
       
    }
 
    const renderCheckValidationForm = () => {
        return (
            <div className="errors" >
                {dataForm.name === "" && <span>Name bạn chưa nhập</span>}
                {dataForm.name.length <= 2 && <span>Name cần 3 ký tự</span>}
                {!validateEmail(dataForm.email) && <span>Email bạn không đúng</span>}
                {dataForm.password === "" && <span>Password bạn chưa nhập</span>}
                {dataForm.password.length < 8 && <span>Password cần 8 ký tự</span>}
                {dataForm.confirm_password === "" && <span>Confirm Password chưa nhập</span>}
                {dataForm.password !== dataForm.confirm_password && <span>Password không khớp</span>}
            </div>
        )
    }
 
    const renderFormRegister = <div className="form-register container-fluid">
            <form class="row g-3 needs-validation container-fluid" style={{maxWidth:"1000px", margin:'0 auto'}} encType="multipart/form-data" >
                <h2 style={{marginTop:'30px', fontSize:'25px',fontWeight:'bolder',textAlign:'center'}}>ĐĂNG KÝ</h2>
                <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input type="text" class="form-control" id="email" name="email"  onChange={(e)=>setDataForm({...dataForm,"email":e.target.value})} required/>
                    <div class="valid-feedback"></div>
                </div>
                <div class="col-md-6">
                    <label for="username" class="form-label">Username</label>
                    <input type="username" class="form-control" id="username" onChange={(e)=>setDataForm({...dataForm,"username":e.target.value})} name="password" required/>
                    <div class="valid-feedback"> </div>
                </div>
                <div class="col-md-6">
                    <label for="password" class="form-label">Mật khẩu</label>
                    <input type="password" class="form-control" id="password" onChange={(e)=>setDataForm({...dataForm,"password":e.target.value})} name="password" required/>
                    <div class="valid-feedback"></div>
                </div>
                <div class="col-md-6">
                    <label for="confirm_password" class="form-label">Nhập lại mật khẩu</label>
                    <input type="confirm_password" class="form-control" id="confirm_password" onChange={(e)=>setDataForm({...dataForm,"confirm_password":e.target.value})} name="confirm_password" required/>
                    <div class="valid-feedback"></div>
                </div>
                <div class="col-md-6">
                    <label for="first_name" class="form-label">Nhập họ</label>
                    <input type="firstname" class="form-control" id="firstname" onChange={(e)=>setDataForm({...dataForm,"firstname":e.target.value})} name="firstname" required/>
                    <div class="valid-feedback">

                    </div>
                </div>

                <div class="col-md-6">
                    <label for="lastname" class="form-label">Nhập tên</label>
                    <input type="lastname" class="form-control" id="lastname" onChange={(e)=>setDataForm({...dataForm,"lastname":e.target.value})} name="lastname" required/>
                    <div class="valid-feedback"></div>
                </div>
                <div class="col-md-6">
                    <label for="birthday" class="form-label">Ngày sinh</label>
                    <input type="date" class="form-control" id="birthday" onChange={(e)=>setDataForm({...dataForm,"birthday":e.target.value})} name="birthday" required/>
                    <div class="valid-feedback"></div>
                </div>
                <div class="col-md-6" >
                    <label className="form-label">Giới tính</label>
                    <select className="form-select" name="gender" onChange={(e)=>setDataForm({...dataForm,"gender":parseInt(e.target.value)})}>
                        {Genders.map(( item) => {
                            return <option key={item.value} value={item.value}>{item.label} </option>;
                        })}
                    </select>
                </div>
                <ImgPrev/>

                <button class="btn btn-primary" style={{margin:'20px auto', width:'250px'}} type="submit" onClick={(e) => checkState("btnRegister",e)}>Đăng ký</button>
                <Link to="/login" style={{margin:'20px auto', width:'250px'}} className="btn btn-primary">Quay lại</Link>
            </form>
        </div>   

 
    return (
        
        <div><h2 className="text-center" style={{paddingTop:'60px', fontSize:'25px',fontWeight:'bolder'}}>QUẢN LÝ CÔNG VIỆC</h2>
            {
                !checkForm.inputForm && renderFormRegister
            }
            {console.log(renderCheckValidationForm)}
        </div>
 
    )
}
 
export default Register
