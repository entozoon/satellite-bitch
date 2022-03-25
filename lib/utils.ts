export const between = (x, a, b) => x > a && x < b;
export const constrain = (x, a, b) => (x = x < a ? a : x > b ? b : x);
