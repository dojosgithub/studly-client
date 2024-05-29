export const getStatusColor = (status) => {
    switch (status) {
        case "Draft":
            return "default";
        case "Submitted":
            return "success";
        case "Reviewed":
        case "Reviewed for record":
        case "Approved (APR)":
            return "info";
        case "Make Corrections Noted (MCN)":
        case "Make Corrections and Resubmit (MCNR)":
            return "warning";
        case "Rejected (RJT)":
            return "error";
        case "Custom":
            return "primary";
        case "Sent to Subcontractor":
            return "secondary";
        default:
            return "default";
    }
};

export const STATUS_WORKFLOW_STUDLY = [
    "Draft",
    "Submitted",
    "Reviewed",
    "Reviewed for record",
    "Approved (APR)",
    "Make Corrections Noted (MCN)",
    "Make Corrections and Resubmit (MCNR)",
    "Rejected (RJT)",
    "Custom",
    "Sent to Subcontractor"
];

export const REVIEW_STATUS = [
    "Approved (APR)",
    "Reviewed for record",
    "Make Corrections Noted (MCN)",
    "Make Corrections and Resubmit (MCNR)",
    "Rejected (RJT)"
];


export const DOC_STATUS = {
    active: 1,
    inactive: 2,
    archived: 3,
    deleted: 4,
}