import React, { useState, memo } from 'react'
import { Layout, Menu } from 'antd';
import {
    UsergroupAddOutlined,
    SettingOutlined,
    DashboardOutlined,
    CalendarOutlined,
    FieldTimeOutlined,
    InsertRowAboveOutlined
} from '@ant-design/icons';
import { Switch } from 'antd';
import logo from '../../../assets/images/logo_company.png'

import { Link } from 'react-router-dom';
const { Sider } = Layout;

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState("light");

    const onCollapse = () => {
        setCollapsed(!collapsed);
    };

    const changeTheme = value => {
        if (value === 'dark') setTheme("light");
        else setTheme("dark");    
    };


    return (
        <Sider theme={theme} collapsible collapsed={collapsed} onCollapse={()=>onCollapse()}>
            <div className="logo" ><img src={logo} style={{height:'100%', textAlign:'center', display:'flex', margin:'auto'}} alt="Logo"></img></div>
            <Switch
                checked={theme === 'dark'}
                onChange={() => changeTheme(theme)}
                // checkedChildren="Dark"
                // unCheckedChildren="Light"
                style={{display:'flex', margin:'auto'}}
            />  
            <Menu theme={theme} defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<UsergroupAddOutlined />}>
                    Quản lý người dùng
                    <Link to="/dashboard"/>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default memo(SideBar);