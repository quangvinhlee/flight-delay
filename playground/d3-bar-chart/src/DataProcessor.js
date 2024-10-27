import data from './data/data.json';

export const readJSON = () => {
    const attributes = Object.keys(data[0]);
    return { data, attributes };
};
