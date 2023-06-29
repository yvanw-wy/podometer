import React from 'react'
import axios from 'axios'

const baseURL = 'http://10.31.64.79:8000/'; // L'addresse IPv4 du PC

type dispatchProps = {
    type_request: string;
    url: string;
    datas?: any;
};

const dispatchAPI = async (props: dispatchProps) => {
    const { type_request, url, datas } = props;
    let response;
    let body;
    switch (type_request) {
        case 'GET':

            const config = {
                onUploadProgress: (progressEvent: any) => {
                    const percentCompleted = (progressEvent.loaded/progressEvent.total)*100
                    console.log('upload', percentCompleted + '%')
                },
                onDownloadProgress: (progressEvent: any) => {
                    const percentCompleted = (progressEvent.loaded/progressEvent.total)*100
                    console.log('download', percentCompleted + '%')
                }
            }

            response = await axios.get(baseURL + url + (datas ? '?' + new URLSearchParams(datas) : ''), config)
            return response.data

            // response = await fetch(baseURL + url + (datas ? '?' + new URLSearchParams(datas) : ''))
            // body = await response.json();
            return body
            break;
        case 'POST':
            response = await fetch(
                baseURL + url,
                {
                    method: "POST",
                    body: JSON.stringify(datas)
                })
            body = await response.json();
            return body
            break;
        default:
            break;
    }
}

export default dispatchAPI