module.exports = function buildForm(form) {
    const fieldNames = Object.keys(form.fields);
    const fields = firldNames.map(field => 
        `<input type="hidden" name="${field}" value="${form.fields[field]}"/>`).join('\n');
    return `
        <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html"; charset="UTF-8" />
        </head>
        <body>
            <form action="${form.url}" method="post" enctype="multipart/form-data">
                ${fields}
                Select a PNG file:
                <input type="file" name="file" /> <br />
                <input type="submit" name="submit" value="Upload file" />
            </form>
        </body>
        </html>
    `   
}