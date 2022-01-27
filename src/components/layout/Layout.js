import './layout.css';
import SideBar from '../sidebar/SideBar';
import TopNav from '../topnav/TopNav';
const Layout = ({children}) => {
    return (
        <div>
            <div className='layout'>
                    <SideBar/>
                    <div className="layout__content">
                        <TopNav/>
                        <div className="layout__content-main">
                            {children}
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Layout;
