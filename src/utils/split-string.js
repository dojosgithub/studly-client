export const getStrTradeId = (str) => {
    // const str = "123.22-2-11-2.11-trade2";
    const lastIndex = str.lastIndexOf("-");
    const valueBeforeHyphen = str.substring(0, lastIndex);

    return valueBeforeHyphen;
}