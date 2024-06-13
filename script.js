document.addEventListener('DOMContentLoaded', function() {

    const video = document.getElementById('video');
    const canvas = document.getElementById('myCanvas');
    const snapBtn = document.getElementById('snap');
    const retakeBtn = document.getElementById('retake');
    const saveBtn = document.getElementById('save');
    const ctx = canvas.getContext('2d');

    const signatureCanvas = document.getElementById('myCanva');
    const signatureCtx = signatureCanvas.getContext('2d');
    const colorPicker = document.getElementById('colorpicker');
    const canvasColorPicker = document.getElementById('canvascolor');
    const fontSizePicker = document.getElementById('fontpicker');
    const redoBtn = document.querySelector('.buttons .btn-danger');
    const saveDownloadBtn = document.querySelector('.buttons .btn-success');
    const retrieveBtn = document.querySelector('.buttons .btn-info');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(err) {
            console.error("Error accessing the camera:", err);
        });

    // Capture photo button
    snapBtn.addEventListener('click', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.style.display = 'none';
        snapBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-block';
        saveBtn.style.display = 'inline-block';
    });

    // Retake photo button
    retakeBtn.addEventListener('click', function() {
        video.style.display = 'block';
        snapBtn.style.display = 'inline-block';
        retakeBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save photo button
    saveBtn.addEventListener('click', function() {
        let dataURL = canvas.toDataURL('image/png');
        let link = document.createElement('a');
        link.href = dataURL;
        link.download = 'quickdocs_snapshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        localStorage.setItem('savedSnapshot', dataURL);
    });


function draw(e) {
    if (!isDrawing) return;


    const rect = signatureCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    signatureCtx.strokeStyle = colorPicker.value;
    signatureCtx.lineWidth = fontSizePicker.value || 1; // Default to 1 if no value provided
    signatureCtx.lineJoin = 'round';
    signatureCtx.lineCap = 'round';
    signatureCtx.beginPath();
    signatureCtx.moveTo(lastX, lastY);
    signatureCtx.lineTo(mouseX, mouseY);
    signatureCtx.stroke();
    lastX = mouseX;
    lastY = mouseY;
}

signatureCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = signatureCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

signatureCanvas.addEventListener('mousemove', draw);
signatureCanvas.addEventListener('mouseup', () => isDrawing = false);
signatureCanvas.addEventListener('mouseout', () => isDrawing = false);


    redoBtn.addEventListener('click', function() {
        signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    });

    // Save and download signature (Save and download button)
    saveDownloadBtn.addEventListener('click', function() {
        let dataURL = signatureCanvas.toDataURL('image/png');
        let link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        localStorage.setItem('savedSignature', dataURL);
    });

    retrieveBtn.addEventListener('click', function() {
        let savedSignature = localStorage.getItem('savedSignature');
        if (savedSignature) {
            let img = new Image();
            img.onload = function() {
                signatureCtx.drawImage(img, 0, 0);
            };
            img.src = savedSignature;
        } else {
            alert("No saved signature found.");
        }
    });

    canvasColorPicker.addEventListener('input', function() {
        signatureCanvas.style.backgroundColor = canvasColorPicker.value;
    });
});
