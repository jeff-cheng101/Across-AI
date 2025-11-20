import request from './request';

export const getEmailReport = async (contractNo: string) => {
    const resp = await request.get(`system_setting/email_report/${contractNo}`);
    return resp;
}

export const createEmailReport = async (data: any) => {
    const resp = await request.post(`system_setting/email_report`, data);
    return resp;
}

export const updateEmailReport = async (data: any) => {
    const resp = await request.put(`system_setting/email_report`, data);
    return resp;
}

export const deleteEmailReport = async (id: number, contractNo: string) => {
    const resp = await request.delete(`system_setting/email_report/${id}`, {
        data: { contractNo }
    });
    return resp;
}

export const sendContactMail = async (data: any) => {
    const resp = await request.post(`system_setting/email_contact`, data);
    return resp;
}