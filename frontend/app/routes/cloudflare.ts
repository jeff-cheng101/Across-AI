import { authClient } from '@/lib/api-clients';

const request = authClient;

export const getZonesByContractNo = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/zones/${contractNo}`);
    return resp;
}

export const getDnsByContractNo = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/dns/${contractNo}`);
    return resp;
}

export const createZone = async (data: any) => {
    const resp = await request.post(`cloudflare_setting`, data);
    return resp;
}

export const deleteZone = async (data: any) => {
    const resp = await request.delete(`cloudflare_setting/${data.contractNo}/${data.zone}`);
    return resp;
}

export const createDnsRecord = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/dns_record`, data);
    return resp;
}

export const updateDnsRecord = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/dns_record/${data.name}`, data);
    return resp;
}

export const deleteDnsRecord = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/delete_dns_record/${data.contractNo}/${data.zone}`, data);
    return resp;
}


export const exportZoneSubdomains = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/export_zone_subdomains/${data.contractNo}`, data);
    return resp;
}

export const importZoneSubdomains = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/import_zone_subdomains/${data.contractNo}`, data);
    return resp;
}

export const getCertificateByContractNo = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/certificate/${contractNo}`);
    return resp;
}

export const uploadCustomCertificate = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/certificate/${data.contractNo}`, data);
    return resp;
}

export const deleteCustomCertificate = async (data: any) => {
    const resp = await request.delete(`cloudflare_setting/certificate/${data.contractNo}/${data.zone}/${data.certificateId}?hosts=${data.hosts}`);
    return resp;
}

export const getWafPolicySettings = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/waf_policy/${contractNo}`);
    return resp;
}

export const getGeolocationList = async () => {
    const resp = await request.get(`cloudflare_setting/geolocation`);
    return resp;
}

export const updateWafPolicySettings = async (data: any, type: string) => {
    const resp = await request.post(`cloudflare_setting/waf_policy/${data.contractNo}/${type}`, data);
    return resp;
}

export const getDDoSSensitivityByContractNo = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/ddos_sensitivity/${contractNo}`);
    return resp;
}

export const updateDDoSSensitivity = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/ddos_sensitivity/${data.contractNo}`, data);
    return resp;
}

export const getCdnCacheByContractNo = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/cdn_cache/${contractNo}`);
    return resp;
}

export const updateCdnCacheRule = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/cdn_cache/${data.contractNo}`, data);
    return resp;
}

export const purgeCache = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/cdn_cache/purge_cache/${data.contractNo}`, data);
    return resp;
}

export const getBotPolicySettings = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/bot_policy/${contractNo}`);
    return resp;
}

export const updateBotPolicySettings = async (data: any, type: string) => {
    const resp = await request.post(`cloudflare_setting/bot_policy/${data.contractNo}/${type}`, data);
    return resp;
}

export const getCustomPolicySettings = async (contractNo: string) => {
    const resp = await request.get(`cloudflare_setting/custom_policy/${contractNo}`);
    return resp;
}

export const updateCustomPolicySettings = async (data: any) => {
    const resp = await request.post(`cloudflare_setting/custom_policy/${data.contractNo}`, data);
    return resp;
}
