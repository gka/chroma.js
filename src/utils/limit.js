const { min, max } = Math;

export default (x, low = 0, high = 1) => {
    return min(max(low, x), high);
};
