import axios from 'axios'
import Config from 'react-native-config'

type unionType = 'post' | 'get' | 'patch' | 'delete' | 'put'
type ParamsType = {
    url: string
    method: unionType
    data?: {} | null
    type?: 'image' | '' | 'none'
    headers?: {}
    params?: {} | null
}

const useFetch = async ({
    url,
    method,
    data,
    type,
    headers,
    params,
}: ParamsType) => {
    console.log(`${Config.API_URL}${url}`, method, data, type, headers, params)
    // const divideEnvApi = `${Config.SERVER_API}:${Config.SERVER_PORT}`;
    const divideEnvApi = `http://10.0.2.2:8000`

    const typeData =
        method === 'get'
            ? {
                  method: 'get',
                  url:
                      type === 'image'
                          ? url
                          : type === 'none'
                          ? ''
                          : `${divideEnvApi}${url}`,
                  params,
              }
            : {
                  method,
                  url:
                      type === 'image'
                          ? url
                          : type === 'none'
                          ? ''
                          : `${divideEnvApi}${url}`,
                  headers,
                  data,
              }
    try {
        return await axios(typeData)
    } catch (err: any) {
        console.log('Error:', err)
        if (!err.response) return { status: 500 }
        return err.response
    }
}

export default useFetch
