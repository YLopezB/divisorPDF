document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
        alert('Archivo PDF.');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            const pdfContainer = document.getElementById('pdf-container');
            pdfContainer.innerHTML = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pdf.getPage(pageNum).then(function(page) {
                    const viewport = page.getViewport({ scale: 0.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    page.render({ canvasContext: context, viewport: viewport }).promise.then(function() {
                        pdfContainer.appendChild(canvas);
                    });
                });
            }
        });
    };
    fileReader.readAsArrayBuffer(file);
});
