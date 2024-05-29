export const updateRevision = (submittalId, newRevisionNumber) => {
    // Regular expression to match the pattern -R[number] at the end of the string
    const regex = /(.*-R)\d+$/;
    const match = submittalId.match(regex);

    if (match) {
        // Replace the current revision number with the new revision number
        return `${match[1]}${newRevisionNumber}`;
    } return `${submittalId}-R${newRevisionNumber}`;

};