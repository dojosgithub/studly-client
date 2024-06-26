export const base64ToFile = (base64String, filename, mimeType = 'application/octet-stream') => {
    // Remove leading/trailing whitespace
    base64String = base64String.trim();

    // Check if it matches expected base64 data URI format
    const match = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!match) {
        throw new Error('Invalid base64 format');
    }

    const [, , base64Data] = match;
    
    // Decode base64 data
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    // Convert binary string to Uint8Array
    for (let i = 0; i < binaryString.length; i += 1) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Create Blob and File objects
    const blob = new Blob([bytes], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
}
