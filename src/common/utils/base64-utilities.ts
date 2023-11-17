export const toBase64 = (param: string) => Buffer.from(param).toString('base64');
export const fromBase64 = (param: string) => Buffer.from(param, 'base64').toString('ascii');
