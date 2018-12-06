module.exports = (args) => {
    if (args.length >= 3) return Array.prototype.slice.call(args);
    return args[0];
};
