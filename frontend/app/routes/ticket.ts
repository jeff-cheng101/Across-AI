import request from './request';

export const getAllTicketNos = async () => {
    const resp = await request.get(`ticket/ticket_nos`);
    return resp;
}

export const createTicket = async (data: any) => {
    const resp = await request.post(`ticket/create`, data);
    return resp;
}

export const getTicketsByUser = async (email: string) => {
    const resp = await request.get(`ticket/user_tickets/${email}`);
    return resp;
}

export const getTicketsById = async (id: string) => {
    const resp = await request.get(`ticket/ticket_detail/${id}`);
    return resp;
}