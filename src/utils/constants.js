export const getStatusColor = (status) => {
    switch (status) {
        case "Draft":
            return "default";
        case "Submitted":
            return "success";
        case "Reviewed":
        case "Reviewed for record":
        case "Approved (APR)":
        case "Make Corrections Noted (MCN)":
        case "Make Corrections and Resubmit (MCNR)":
            return "info";
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