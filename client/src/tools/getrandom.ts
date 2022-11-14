const max = 9999999;
const min = 1;
const getRandom = () => Math.floor(Math.random() * (max - min) + min);

export { getRandom }