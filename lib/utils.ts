export const sleep = (ms: number = 2000) => new Promise((r) => setTimeout(r, ms));
