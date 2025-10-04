export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    };
    
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const getCurrentTimestamp = () => {
    return new Date().toISOString();
};

export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
};

export const getStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
};

export const getEndOfDay = (date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
}; 