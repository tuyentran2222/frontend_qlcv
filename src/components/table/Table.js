import React, {useEffect, useState} from 'react'
import { Pagination } from 'antd';
import './table.css';
const Table = props => {
    let [initDataShow] =useState(props.limit && props.bodyData ? props.bodyData.slice(0, Number(props.limit)) : props.bodyData);
    const [dataShow, setDataShow] = useState(initDataShow);
    const [numPerPages, setNumPerPages] = useState(10);
    const [order,setOrder] = useState('ASC');

    const onChange = (current) => {
        const start = Number(numPerPages) * (current-1);
        const end = start + Number(numPerPages);
        setDataShow(props.bodyData.slice(start, end));
    }

    const onShowSizeChange = (current, pageSize) => {
        setNumPerPages(pageSize);
    }
    
    const sorting = (col, sortable , type) => {
        if (sortable !== false) {
            let dataSorted = [];
            let factor = 1;
            if (order !== 'ASC') factor = -1; 
            switch (type) {
                case 'string':
                    dataSorted = [...props.bodyData].sort((a,b) =>
                        a[col].toLowerCase() >  b[col].toLowerCase() ? factor*1 : factor*(-1)
                    );
                    break;
                case 'number':
                    dataSorted = props.bodyData.sort((a,b) =>
                        a[col] >  b[col] ? factor*1 : factor*(-1)
                    );
                    break;
                case 'date':
                    dataSorted = props.bodyData.sort((a,b) =>
                        new Date(a[col]) >  new Date(b[col]) ? factor*1 : factor*(-1)
                    );
                    break;
                default:
                    console.log("Lỗi sắp xếp kiểu không hỗ trợ");
            }
            
            setDataShow(props.limit && props.bodyData ? dataSorted.slice(0, Number(props.limit)) : dataSorted);
            if (order === 'ASC') setOrder('DSC'); else setOrder("ASC");
        }
    }

    useEffect(()=>{
        setDataShow(numPerPages && props.bodyData ? props.bodyData.slice(0, Number(numPerPages)) : props.bodyData)
    },[props.bodyData, numPerPages])
    
    return (
        <div>
            <div className="table-wrapper">
                <table>
                    {
                        props.headData && props.renderHead ? (
                            <thead>
                                <tr>
                                    {
                                        props.headData.map((item, index) => {
                                            return <th key={index} onClick = {()=> sorting(item[1], item[2], item[3])}>{item[0]}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                        ) : null
                    }
                    {
                        props.bodyData && props.renderBody ? (
                            <tbody>
                                {
                                    dataShow.map((item, index) => props.renderBody(item, index))
                                }
                            </tbody>
                        ) : null
                    }
                </table>
            </div>
            <Pagination
                className="pagination-bottom"
                onChange={(current)=>onChange(current)}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={props.bodyData.length}
            />
        </div>
    )
}

export default Table
