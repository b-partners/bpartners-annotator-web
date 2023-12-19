export const dateFormater = (date: any) => new Date(date).toISOString().split('.')[0].replace('T', ' ');
