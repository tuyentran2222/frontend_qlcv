import axios from "axios";

const verifyToken = async (token) => {
    await axios.post('/api/authentication/verifyToken', {token : localStorage.getItem('token')})
    .then(res =>{
        console.log(res)
        if (res.data.code === 200) return true;
        else return false;
    })
}

function useAuth(callback) {
    let auth = callback();
    console.log(auth)
    return auth;
}

export default useAuth;
export {verifyToken};