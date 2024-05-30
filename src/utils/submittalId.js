export const updateSubmittalId = (submittalId, revisionCount) => {
    const regex = /(.*-R)(\d+)$/;
    const match = submittalId.match(regex);

    if (match) {
        // Case 1: submittalId contains -R[number]
        const baseId = match[1]; // The part before the revision number
        const currentRevisionNumber = parseInt(match[2], 10); // The current revision number
        const nextRevisionNumber = currentRevisionNumber + 1; // Increment the revision number
        return `${baseId}${nextRevisionNumber}`;
    }
    // Case 2: submittalId does not contain -R[number]
    if (revisionCount === 0) {
        return `${submittalId}-R`;
    }
    return `${submittalId}-R${revisionCount}`;

};