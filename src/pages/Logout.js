import {useEffect , useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from '../components/spinner/Spinner';
import { message } from 'antd';

const Logout = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`/api/logout`).then( res => {
          if(res.data.code === 200)
          {
            localStorage.removeItem('token');
            setLoading(false);
            message.success(res.data.message)
            navigate('/login');
          }
          else if(res.data.code > 200)
          {
            message.error(res.data.message)
          }
          
        }).catch(error => navigate('/login'));
    });

    if (loading) {
      return <Spinner/>
    }
    else return <></>;
}

export default Logout;