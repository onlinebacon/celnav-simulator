export default (query) => {
    const entries = query.split('&').map(item => item.split('='));
    return Object.fromEntries(entries);
};
