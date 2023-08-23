import { useEffect, useState } from "react";
import { TableItem } from "./table-item.component";
import axios from "axios";

export const MatchPanel = ({data, onSelected, selectAll, handleBack}) => {
    const [mode, setMode] = useState(0)
    return (
        <div>
            <div className="title back" onClick={handleBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                Add Item
            </div>
            <br />
            <br />
            <br />
            <div className="row">
                <div className="col">You have {data.length} items on the inventory list</div>
                <div className="col right">
                    { mode === 0 ? <button className="btn btn-primary btn-max" onClick={()=> setMode(1)} >Select</button> 
                    :
                    <>
                        <button className="btn btn-primary btn-max" onClick={selectAll}>Select All</button>&nbsp;
                        <button className="btn btn-primary btn-max" onClick={()=> setMode(1)}>Import</button> 
                    </>
                    }
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col">
                <table className="table table-striped">
                    <thead>
                        <tr className="table-primary">
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Current Price</th>
                            <th scope="col">Existing Competitor(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data.map((item)=> (
                            <TableItem item={item} mode={mode} key={item.id} onSelected={onSelected} />
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}
