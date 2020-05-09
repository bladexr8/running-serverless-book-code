// retrieve an object with combined signatures
// for uploading and downloading, given an
// API URL
async function getSignatures(apiUrl) {
    if (!apiUrl) {
        throw 'Please provide an API URL';
    }
    const response = await fetch(apiUrl);
    return response.json();
};

// utility function to submit form data in the
// back using async network request
function postFormData(url, formData, progress) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        const sendError = (e, label) => {
            console.error(e);
            reject(label);
        };
        request.open('POST', url);
        request.upload.addEventListener('error', e => sendError(e, 'upload error'));
        request.upload.addEventListener('timeout', e => sendError(e, 'upload timeout'));
        request.upload.addEventListener('progress', progress);
        request.addEventListener('load', () => {
            if (request.status >= 200 && request.status < 400) {
                resolve();
            } else {
                reject(request.responseText);
            }
        });
        request.addEventListener('error', e => sendError(e, 'server error'));
        request.addEventListener('abort', e => sendError(e, 'server aborted request'));
        request.send(formData);
    });
};
