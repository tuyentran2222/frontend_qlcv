import {React, useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
// import  Dropdown  from "../dropdown/Dropdown";
import user_menu from '../../assets/json/user_menu.json';
import './topnav.css';
import { AppContext } from "../context/Context";
import { Menu, Button, Dropdown,Image } from "antd";

const menu = (
    <Menu>
      <Menu.Item>
        <Link rel="noopener noreferrer" to="/user">
          Quản lý tài khoản
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link rel="noopener noreferrer" to="/logout">
          Đăng xuất
        </Link>
      </Menu.Item>
    </Menu>
);


const TopNav = ($props)=> {
    const [user, setUser] = useState({
        username: "",
        firstname: "",
        lastname: "",  
        avatar: "",
        gender: "",
        email: "",
        id:''
    });

    const [avatar, setAvatar] = useContext(AppContext).avatar;
    
    useEffect(() => {
        axios.get("/api/getUser").then(res=> {
            if (res.data.code === 200) {
                setUser(res.data.data);
                setAvatar(` http://localhost:8000${res.data.data.avatar}`);
            }
        })
    }, []);

    const curr_user = {
        name: user.username,
        image_url: `${avatar}`
    }

    return (
        <div className="topnav">
            <div className="topnav__search">
                
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <Button style={{display:"flex", justifyContent:'center', alignItems:'center', height:'50px'}}>
                            <Image
                                width={40}
                                src={curr_user.image_url}
                                style={{marginRight:'20px'}}
                            />
                            {curr_user.name}
                        </Button>
                    </Dropdown>
                </div>    
            </div>
        </div>
    );
}

export default TopNav;