import request from './request';

export const getContractsInfo = async () => {
    const resp = await request.get(`contracts/info`);
    return resp;
}

export const getContractsInfoByReseller = async (userId: string, email: string) => {
    const resp = await request.get(`contracts/info/${userId}/${email}`);
    return resp;
}

export const getLogs = async () => {
    const resp = await request.get(`contracts/logs`);
    return resp;
}

export const createContract = async (contract: any) => {
    const resp = await request.post(`contracts/create`, contract);
    return resp;
}

export const getPlans = async () => {
    const resp = await request.get(`contracts/plans`);
    return resp;
}

export const updatePlan = async (plan: any) => {
    const resp = await request.post(`contracts/update_plan`, plan);
    return resp;
}
