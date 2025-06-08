document.addEventListener('DOMContentLoaded', () => {
    const qrInput = document.getElementById('qrInput');
    const qrDisplay = document.getElementById('qrDisplay');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const qrSize = document.getElementById('qrSize');
    const qrErrorCorrection = document.getElementById('qrErrorCorrection');
    const qrColorDark = document.getElementById('qrColorDark');
    const qrColorLight = document.getElementById('qrColorLight');
    const qrLogoFile = document.getElementById('qrLogoFile');
    const logoPreview = document.getElementById('logoPreview');
    const qrLogoSize = document.getElementById('qrLogoSize');
    const qrLogoSizeValue = document.getElementById('qrLogoSizeValue');
    const toastContainer = document.createElement('div');
    
    // New elements for QR code types
    const qrCodeType = document.getElementById('qrCodeType');
    const textInputSection = document.getElementById('textInputSection');
    const wifiInputSection = document.getElementById('wifiInputSection');
    const contactInputSection = document.getElementById('contactInputSection');
    const wifiSsid = document.getElementById('wifiSsid');
    const wifiPassword = document.getElementById('wifiPassword');
    const wifiEncryption = document.getElementById('wifiEncryption');
    const contactName = document.getElementById('contactName');
    const contactPhone = document.getElementById('contactPhone');
    const contactEmail = document.getElementById('contactEmail');
    const contactOrg = document.getElementById('contactOrg');

    // New elements for scan functionality
    const generateModeBtn = document.getElementById('generateModeBtn');
    const scanModeBtn = document.getElementById('scanModeBtn');
    const generatorSection = document.getElementById('generatorSection');
    const scannerSection = document.getElementById('scannerSection');
    const reader = document.getElementById('reader');
    const scannerResult = document.getElementById('scannerResult');
    const scannedContent = document.getElementById('scannedContent');
    const stopScanBtn = document.getElementById('stopScanBtn');
    
    // Add toast container to body
    document.body.appendChild(toastContainer);
    
    let html5QrcodeScanner; // Declare scanner instance globally (within DOMContentLoaded scope)

    function initializeScanner() {
        if (!html5QrcodeScanner) { // Only initialize if not already initialized
            html5QrcodeScanner = new Html5QrcodeScanner(
                "reader", 
                { fps: 10, qrbox: {width: 250, height: 250} },
                /* verbose= */ false
            );

            html5QrcodeScanner.render(onScanSuccess, onScanError).catch(err => {
                console.error("Error starting scanner:", err);
                showToast('Failed to start camera. Please ensure you have granted camera permissions.', 'error');
            });
        }
    }

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        scannedContent.textContent = decodedText;
        scannerResult.classList.remove('hidden');
        // Optionally stop scanning after a successful scan
        // if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        //     html5QrcodeScanner.stop().then(() => {
        //         showToast('QR Code Scanned Successfully!', 'success');
        //         stopScanBtn.classList.add('hidden');
        //     }).catch(err => {
        //         console.error("Failed to stop scanner.", err);
        //     });
        // }
    }

    function onScanError(errorMessage) {
        // console.warn(`Code scan error = ${errorMessage}`);
    }

    // Mode switching logic
    generateModeBtn.addEventListener('click', () => {
        generatorSection.classList.remove('hidden');
        scannerSection.classList.add('hidden');
        generateModeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        generateModeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
        scanModeBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
        scanModeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
            html5QrcodeScanner.stop().catch(err => console.error("Failed to stop scanner on mode switch:", err));
        }
        stopScanBtn.classList.add('hidden');
        scannerResult.classList.add('hidden');
        generateQRCode(); // Ensure QR code is generated when switching back
    });

    scanModeBtn.addEventListener('click', () => {
        generatorSection.classList.add('hidden');
        scannerSection.classList.remove('hidden');
        scanModeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        scanModeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
        generateModeBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
        generateModeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        
        initializeScanner(); // Initialize and start scanner when scan mode is activated
        stopScanBtn.classList.remove('hidden');
    });

    stopScanBtn.addEventListener('click', () => {
        if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
            html5QrcodeScanner.stop().then(() => {
                showToast('Scanner stopped.', 'info');
                stopScanBtn.classList.add('hidden');
                scannerResult.classList.add('hidden');
            }).catch(err => {
                console.error("Failed to stop scanner:", err);
                showToast('Error stopping scanner.', 'error');
            });
        }
    });
    
    // Toast function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    qrInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });
    qrInput.addEventListener('input', generateQRCode); // Synchronize text/URL input

    // Function to toggle input sections based on QR code type
    function toggleInputSections() {
        const selectedType = qrCodeType.value;
        textInputSection.classList.add('hidden');
        wifiInputSection.classList.add('hidden');
        contactInputSection.classList.add('hidden');

        // Clear input values when sections are hidden to prevent stale data
        qrInput.value = '';
        wifiSsid.value = '';
        wifiPassword.value = '';
        contactName.value = '';
        contactPhone.value = '';
        contactEmail.value = '';
        contactOrg.value = '';
        
        if (selectedType === 'text') {
            textInputSection.classList.remove('hidden');
        } else if (selectedType === 'wifi') {
            wifiInputSection.classList.remove('hidden');
            wifiSsid.addEventListener('input', generateQRCode);
            wifiPassword.addEventListener('input', generateQRCode);
            wifiEncryption.addEventListener('change', generateQRCode);
        } else if (selectedType === 'contact') {
            contactInputSection.classList.remove('hidden');
            contactName.addEventListener('input', generateQRCode);
            contactPhone.addEventListener('input', generateQRCode);
            contactEmail.addEventListener('input', generateQRCode);
            contactOrg.addEventListener('input', generateQRCode);
        }
    }

    // Initial call to set correct section visibility
    toggleInputSections();

    // Initial QR code generation on page load
    setTimeout(generateQRCode, 100); // Added a small delay to ensure QRCode library is loaded

    // Event listener for QR code type change
    qrCodeType.addEventListener('change', () => {
        toggleInputSections();
        generateQRCode(); // Regenerate QR code immediately after type change
    });

    // Update QR code when options change
    qrSize.addEventListener('change', generateQRCode);
    qrErrorCorrection.addEventListener('change', generateQRCode);
    qrColorDark.addEventListener('input', generateQRCode);
    qrColorLight.addEventListener('input', generateQRCode);
    
    // Event listener for logo file input
    qrLogoFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                logoPreview.src = e.target.result;
                logoPreview.classList.remove('hidden');
                generateQRCode();
            };
            reader.onerror = () => {
                showToast('Failed to read logo file.', 'error');
                logoPreview.src = '';
                logoPreview.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            logoPreview.src = '';
            logoPreview.classList.add('hidden');
            generateQRCode();
        }
    });

    // Event listener for logo size slider
    qrLogoSize.addEventListener('input', () => {
        qrLogoSizeValue.textContent = `${qrLogoSize.value}%`;
        generateQRCode();
    });

    function generateQRCode() {
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library is not defined. Cannot generate QR code.');
            showToast('QR Code library not loaded. Please try refreshing.', 'error');
            return;
        }

        let text = '';
        const selectedType = qrCodeType.value;

        if (selectedType === 'text') {
            text = qrInput.value.trim();
        } else if (selectedType === 'wifi') {
            const ssid = wifiSsid.value.trim();
            const password = wifiPassword.value.trim();
            const encryption = wifiEncryption.value;
            if (!ssid) {
                showToast('Please enter Wi-Fi SSID', 'error');
                return;
            }
            text = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
        } else if (selectedType === 'contact') {
            const name = contactName.value.trim();
            const phone = contactPhone.value.trim();
            const email = contactEmail.value.trim();
            const org = contactOrg.value.trim();

            if (!name && !phone && !email && !org) {
                showToast('Please enter at least one contact detail', 'error');
                return;
            }

            text = `BEGIN:VCARD\nVERSION:3.0\n`;
            if (name) text += `FN:${name}\n`;
            if (phone) text += `TEL;TYPE=CELL:${phone}\n`;
            if (email) text += `EMAIL:${email}\n`;
            if (org) text += `ORG:${org}\n`;
            text += `END:VCARD`;
        }

        if (!text) {
            // If text is empty, clear the display and hide buttons, do not show an error toast.
            qrDisplay.innerHTML = '';
            downloadBtn.classList.add('hidden');
            copyBtn.classList.add('hidden');
            return;
        }

        // Clear previous QR code and logo
        qrDisplay.innerHTML = '';

        // Get selected options
        const size = parseInt(qrSize.value);
        const errorCorrection = qrErrorCorrection.value;
        const colorDark = qrColorDark.value;
        const colorLight = qrColorLight.value;
        const logoDataUrl = logoPreview.src; // Get the data URL from the preview image
        const logoSizePercentage = parseInt(qrLogoSize.value) / 100;

        // Create QR code
        const qr = new QRCode(qrDisplay, {
            text: text,
            width: size,
            height: size,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel[errorCorrection]
        });

        // After QR code is generated, get the canvas element and center it
        const qrCanvas = qrDisplay.querySelector('canvas');
        if (qrCanvas) {
            qrCanvas.style.display = 'block';
            qrCanvas.style.margin = '0 auto';
        }

        // Add logo if URL is provided
        if (logoDataUrl && !logoPreview.classList.contains('hidden')) {
            const img = document.createElement('img');
            img.src = logoDataUrl;
            img.alt = 'QR Code Logo';
            img.style.position = 'absolute';
            img.style.width = `${size * logoSizePercentage}px`; // Use logoSizePercentage
            img.style.height = `${size * logoSizePercentage}px`; // Use logoSizePercentage
            img.style.top = '50%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.style.zIndex = '10';
            
            // Ensure the qrDisplay container is positioned for absolute children
            qrDisplay.style.position = 'relative';

            img.onload = () => {
                qrDisplay.appendChild(img);
            };
            img.onerror = () => {
                showToast('Failed to load logo image. Please check the file.', 'error');
            };
        }

        downloadBtn.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
        showToast('QR Code generated successfully!');
    }

    downloadBtn.addEventListener('click', () => {
        const img = qrDisplay.querySelector('img');
        if (img) {
            // For download, if logo is present, we need to create a canvas composite
            if (qrDisplay.querySelector('img[alt="QR Code Logo"]')) {
                const qrCanvas = qrDisplay.querySelector('canvas');
                if (qrCanvas) {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = qrCanvas.width;
                    tempCanvas.height = qrCanvas.height;
                    const ctx = tempCanvas.getContext('2d');

                    ctx.drawImage(qrCanvas, 0, 0);
                    
                    const logoImg = qrDisplay.querySelector('img[alt="QR Code Logo"]');
                    if (logoImg) {
                        // Calculate logo position and size relative to QR code canvas
                        const logoWidth = logoImg.width;
                        const logoHeight = logoImg.height;
                        const logoX = (qrCanvas.width - logoWidth) / 2;
                        const logoY = (qrCanvas.height - logoHeight) / 2;
                        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
                    }
                    
                    const link = document.createElement('a');
                    link.download = 'qrcode_with_logo.png';
                    link.href = tempCanvas.toDataURL('image/png');
                    link.click();
                    showToast('QR Code with logo downloaded successfully!');
                } else {
                    showToast('QR Code canvas not found for download.', 'error');
                }
            } else {
                // Original download logic if no logo
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = img.src;
                link.click();
                showToast('QR Code downloaded successfully!');
            }
        } else {
            showToast('No QR Code to download.', 'error');
        }
    });

    copyBtn.addEventListener('click', () => {
        const text = qrInput.value.trim();
        if (text) {
            navigator.clipboard.writeText(text)
                .then(() => showToast('Text copied to clipboard!'))
                .catch(err => showToast('Failed to copy text: ' + err, 'error'));
        } else {
            showToast('No text to copy.', 'error');
        }
    });

    // Initial call to set correct section visibility
    toggleInputSections();

    // Initial QR code generation on page load
    generateQRCode();

});

function loadAds() {
    // Simulate ad loading for development
    // In a real scenario, you'd load AdSense ads here
    // For example:
    // (adsbygoogle = window.adsbygoogle || []).push({});
}

// Load ads when the document is ready (if not already loaded by AdSense script)
document.addEventListener('DOMContentLoaded', loadAds);
