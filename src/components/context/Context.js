import { createContext, useState } from 'react';
import avatarDefaultUrl from '../../assets/images/avatar.jpg';
export const AppContext = createContext();

export const Context = (props) => {
    const [projectName, setProjectName] = useState([]);
    const [comments, setComments] = useState([]);
    const [avatar, setAvatar] = useState(avatarDefaultUrl);
    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState({});
    const value = {
        avatar:[avatar,setAvatar],
        projectName: [projectName, setProjectName],
        comments: [comments, setComments],
        members: [members, setMembers],
        projects: [projects, setProjects],
        user : [user, setUser]
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
} 
