import {Alert, Box, Fab, Grid, LinearProgress, List, ListItem, Typography} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useEffect, useState} from "react";
import BackButton from "../../../../../components/BackButton";
import {authedRequest} from "../../../../../http";
import {ToastTypes, useToast} from "../../../../../components/Toast";

export default function ImportFromFile() {

  const [uploadProgress, setUploadProgress] = useState(0);
  const [insertDone, setInsertDone] = useState(false);

  const [files, setFiles] = useState([]);
  const {show} = useToast();
  const handleSelectFile = async (e) => {
    setInsertDone(false);
    const selectedFiles = [...e.target.files];
    setFiles([...files, ...selectedFiles])



    const formData = new FormData();
    formData.append('uploadFiles', JSON.stringify(selectedFiles.map(item => item.name)));
    for (let selectedFile of selectedFiles) {
      formData.append(selectedFile.name, selectedFile);
    }
    try {
      const res = await authedRequest.post(`/api/goods/import-my-products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (evt) => {
            const {loaded, total} = evt;
            const percent = Math.floor((loaded * 100) / total);
            setUploadProgress(percent);
          }
        });
      console.log(res)
      show(ToastTypes.SUCCESS, "Success import to " + res.data.count + " products!");
      setInsertDone(true);
    } catch (err) {
      console.log(err);
    }

  }


  return (
    <Box>
      <Box className={'mt-3  d-flex justify-content-center align-items-center flex-column'}
        style={{
          height: '30vh'
        }}
      >
        <Fab color={'secondary'} size={'large'} component={'label'}>
          <CloudUploadIcon />
          <input
            onChange={handleSelectFile}
            multiple
            hidden type={'file'} accept={'application/json, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}/>
        </Fab>
        <Typography className={'mt-2'} variant={'h6'}>
        Please upload your document here
        </Typography>
        <Typography variant={'subtitle2'}>
          Support files are csv, xls, xlsx, json.
        </Typography>
        <Typography variant={'subtitle2'}>
          <a target={'_blank'} href={process.env.REACT_APP_SERVER_HOST + `/my-product-templates.xlsx`}>csv, xls, xlsx template</a>
        </Typography>
        <Typography variant={'subtitle2'}>
          <a target={'_blank'} href={process.env.REACT_APP_SERVER_HOST + `/my-product-templates.json`}>json template</a>
        </Typography>
        {/*<Typography variant={'subtitle2'}>*/}
        {/*  Max file size: 100MB*/}
        {/*</Typography>*/}
      </Box>

      <List className={'mt-3'}>
        {files.map(file => {
          return (
            <ListItem key={file.lastModified}>
              <Box className={'p-3 w-100'}>
                <Typography
                  className={'fw-bold'}
                  variant={'subtitle2'}>
                  {file.name}
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Alert icon={false} className={'mt-3'} severity={insertDone ? 'success' : 'info'}>
                  {!insertDone && uploadProgress < 100 && (
                    <Typography>
                      Uploaded {uploadProgress} %
                    </Typography>
                  )}
                  {!insertDone && uploadProgress === 100 && (
                    <Typography>
                      Upload succeeded. Inserting...
                    </Typography>
                  )}
                  {insertDone && (
                    <Typography>
                      Import Done
                    </Typography>
                  )}
                </Alert>
              </Box>
            </ListItem>
          )
        })}

      </List>

    </Box>
  )
}