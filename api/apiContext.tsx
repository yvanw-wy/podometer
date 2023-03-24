import React from 'react'
import axios from 'axios'

const baseURL = 'http://10.31.81.17:8000/'; // 'http://10.31.81.17:8000/'

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
            response = await fetch(baseURL + url + (datas ? '?' + new URLSearchParams(datas) : ''))
            body = await response.json();
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