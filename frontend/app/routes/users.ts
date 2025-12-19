import request from './request';

export const getUsers = async () => {
    const resp = await request.get(`users`);
    return resp;
}

export const getUsersInfo = async () => {
    const resp = await request.get(`users/info`);
    return resp;
}

export const createReseller = async (data: any) => {
    const resp = await request.post(`users/reseller`, data);
    return resp;
}

export const updateReseller = async (data: any) => {
    const resp = await request.put(`users/reseller`, data);
    return resp;
}

export const createUser = async (data: any) => {
    const resp = await request.post(`users/user`, data);
    return resp;
}

export const updateUser = async (data: any) => {
    const resp = await request.put(`users/user`, data);
    return resp;
}