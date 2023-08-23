export const UploadResultPanel = ({file, handleNext, error}) => (
    <div className="upload-panel card">
        <div className="row">
            <div className="col left">{file.name}</div>
            <div className="col right">{ error? error:"Upload Successful "}
            {!error && <button className="btn btn-success" onClick={()=> handleNext("match")}>Review</button>}</div>
        </div>
    </div>
)