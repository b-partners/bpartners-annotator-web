export const stringCutter = (value: string, max: number) => {
    if (!value || value.length <= max) {
        return value;
    }
    return `${value.slice(0, max - 3)}...`;
};
