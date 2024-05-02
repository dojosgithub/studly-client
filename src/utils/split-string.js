export const getStrTradeId = (str) => {
    // const str = "123.22-2-11-2.11-trade2";
    const lastIndex = str.lastIndexOf("-");
    const valueBeforeHyphen = str.substring(0, lastIndex);

    console.log(valueBeforeHyphen); // Output: 123.22-2
    return valueBeforeHyphen;
}