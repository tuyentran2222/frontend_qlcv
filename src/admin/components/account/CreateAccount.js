import React, { useState } from 'react';
import { message, Modal } from 'antd';
import {EditOutlined, PlusSquareOutlined } from '@ant-design/icons';

import {
  Form,
  Input,
  Button,
  Select,
} from 'antd';
import moment from 'moment';
import axios from 'axios';
const dateFormat = "YYYY-MM-DD";
const { Option } = Select;

const CreateAccount = ({user, title="Sửa thông tin", create = false}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentSize, setComponentSize] = useState('default');
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (value) => {
    console.log(value);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = (value) => {
    if (value.email == undefined) value.email = user.email;
    if (value.username == undefined) value.username = user.username;
    if (value.firstname == undefined) value.firstname = user.firstname;
    if (value.lastname == undefined) value.lastname = user.lastname;
    if (value.gender == undefined) value.gender =parseInt(user.gender);
    value.gender = parseInt(value.gender);
    axios.post('api/admin/user/update/' + user.id, value).then( (res) => {
        if (res.data.code === 200){
            console.log(res.data);
            message.success(res.data.message);
            handleCancel();
        }
        else
        console.log(res.data.data)
    }

    )
    ;
    console.log(value)
  }
  return (
    <>
      <Button onClick={showModal}
        icon={!create?<EditOutlined />:<PlusSquareOutlined />}>
      </Button>
      <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 14,
            }}
            layout="horizontal"
            initialValues={{
                size: componentSize,
            }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
            onFinish={onFinish}
        >
            <Form.Item label="Email" name="email">
                <Input defaultValue={user!=null?user.email:""}/>
            </Form.Item>
            <Form.Item label="Username" name="username">
                <Input defaultValue={user!=null?user.username:""} />
            </Form.Item>
            {create?
            <>
            <Form.Item label="Mật khẩu">
                <Input.Password />
            </Form.Item>
            <Form.Item label="Nhập lại mật khẩu">
                <Input.Password />
            </Form.Item>
            </>
            
            :""}
            <Form.Item label="Họ" name="firstname">
                <Input defaultValue={user!=null?user.firstname:""} />
            </Form.Item>
            <Form.Item label="Tên" name="lastname">
                <Input defaultValue={user!=null?user.lastname:""} />
            </Form.Item>
    
            <Form.Item label="Giới tính" name="gender">
                <Select defaultValue={(user!=null?user.gender.toString():"")}>
                    <Option value="1">Nam</Option>
                    <Option value="2">Nữ</Option>
                    <Option value="3">Khác</Option>
                </Select>
        </Form.Item>
        <Form.Item
            wrapperCol={{
                offset: 20,
                span: 16,
            }}
        >
            <Button type="primary" htmlType="submit" size="small">
                {create? "Tạo mới": "Cập nhật"}
            </Button>
        </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateAccount;