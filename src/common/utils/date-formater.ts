export const dateFormater = (date: any) => (!!date ? new Date(date).toISOString().split('.')[0].replace('T', ' ') : '');
