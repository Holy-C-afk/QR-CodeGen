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
    const qrLoadingSpinner = document.getElementById('qrLoadingSpinner');
    const toastContainer = document.createElement('div');
    
    // New elements for QR code styling
    const qrDotStyle = document.getElementById('qrDotStyle');
    const qrCornersSquareStyle = document.getElementById('qrCornersSquareStyle');
    const qrCornersDotStyle = document.getElementById('qrCornersDotStyle');
    // New elements for gradient dot styling
    const qrDotColorType = document.getElementById('qrDotColorType');
    const qrDotGradientOptions = document.getElementById('qrDotGradientOptions');
    const qrDotColorGradientType = document.getElementById('qrDotColorGradientType');
    const qrDotColorGradientRotation = document.getElementById('qrDotColorGradientRotation');
    const qrDotColorGradientStart = document.getElementById('qrDotColorGradientStart');
    const qrDotColorGradientEnd = document.getElementById('qrDotColorGradientEnd');

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
    let currentQRCode; // Declare a variable to hold the QRCodeStyling instance
    let latestGeneratedText = ''; // New: To store the latest generated QR code content

    // New elements for border/frame styling
    const qrBorderEnabled = document.getElementById('qrBorderEnabled');
    const qrBorderOptions = document.getElementById('qrBorderOptions');
    const qrBorderColor = document.getElementById('qrBorderColor');
    const qrBorderWidth = document.getElementById('qrBorderWidth');
    const qrBorderRadius = document.getElementById('qrBorderRadius');

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
        qrLoadingSpinner.classList.remove('hidden'); // Show spinner
        
        if (typeof QRCodeStyling === 'undefined') {
            console.error('QRCodeStyling library is not defined. Cannot generate QR code.');
            showToast('QR Code Styling library not loaded. Please try refreshing.', 'error');
            qrLoadingSpinner.classList.add('hidden'); // Hide spinner on error
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
                // Do not show a toast for empty SSID on initial load or type switch
                // qrLoadingSpinner.classList.add('hidden');
                // return;
            }
            text = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
        } else if (selectedType === 'contact') {
            const name = contactName.value.trim();
            const phone = contactPhone.value.trim();
            const email = contactEmail.value.trim();
            const org = contactOrg.value.trim();

            if (!name && !phone && !email && !org) {
                // Do not show a toast for empty contact details on initial load or type switch
                // qrLoadingSpinner.classList.add('hidden');
                // return;
            }

            text = `BEGIN:VCARD\nVERSION:3.0\n`;
            if (name) text += `FN:${name}\n`;
            if (phone) text += `TEL;TYPE=CELL:${phone}\n`;
            if (email) text += `EMAIL:${email}\n`;
            if (org) text += `ORG:${org}\n`;
            text += `END:VCARD`;
        }
        
        // If text is empty, clear the display and hide buttons/spinner
        if (!text) {
            qrDisplay.innerHTML = '';
            downloadBtn.classList.add('hidden');
            copyBtn.classList.add('hidden');
            downloadBtn.style.opacity = '0';
            copyBtn.style.opacity = '0';
            qrLoadingSpinner.classList.add('hidden');
            return;
        }

        latestGeneratedText = text; // Store the generated text

        // Get selected options
        const size = parseInt(qrSize.value);
        const errorCorrection = qrErrorCorrection.value;
        const colorDark = qrColorDark.value;
        const colorLight = qrColorLight.value;
        const logoDataUrl = logoPreview.src;
        const logoSizePercentage = parseInt(qrLogoSize.value) / 100;
        const dotStyle = qrDotStyle.value;
        const cornersSquareStyle = qrCornersSquareStyle.value;
        const cornersDotStyle = qrCornersDotStyle.value;
        const dotColorType = qrDotColorType.value;
        const dotColorGradientType = qrDotColorGradientType.value;
        const dotColorGradientRotation = parseInt(qrDotColorGradientRotation.value);
        const dotColorGradientStart = qrDotColorGradientStart.value;
        const dotColorGradientEnd = qrDotColorGradientEnd.value;

        const borderEnabled = qrBorderEnabled.checked;
        const borderColor = qrBorderColor.value;
        const borderWidth = parseInt(qrBorderWidth.value);
        const borderRadius = parseInt(qrBorderRadius.value);

        // Clear previous QR code if it exists
        if (currentQRCode) {
            qrDisplay.innerHTML = ''; // Clear the display container
        }

        const dotsOptions = {};
        if (dotColorType === 'gradient') {
            dotsOptions.gradient = {
                type: dotColorGradientType,
                rotation: (dotColorGradientRotation * Math.PI) / 180, // Convert degrees to radians
                colorStops: [
                    { offset: 0, color: dotColorGradientStart },
                    { offset: 1, color: dotColorGradientEnd }
                ]
            };
        } else {
            dotsOptions.color = colorDark;
        }
        dotsOptions.type = dotStyle;

        currentQRCode = new QRCodeStyling({
            width: size,
            height: size,
            type: "svg", // Changed to SVG for custom extensions
            data: text,
            image: logoDataUrl && !logoPreview.classList.contains('hidden') ? logoDataUrl : undefined,
            margin: 10,
            qrOptions: {
                errorCorrectionLevel: errorCorrection,
            },
            dotsOptions: dotsOptions,
            backgroundOptions: {
                color: colorLight,
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5,
                imageSize: logoSizePercentage,
            },
            cornersSquareOptions: {
                color: colorDark,
                type: cornersSquareStyle,
            },
            cornersDotOptions: {
                color: colorDark,
                type: cornersDotStyle,
            }
        });

        if (borderEnabled) {
            const borderExtension = (svg) => {
                const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                const borderAttributes = {
                    "fill": "none",
                    "x": 0,
                    "y": 0,
                    "width": size + 20, // size + 2 * margin
                    "height": size + 20, // size + 2 * margin
                    "stroke": borderColor,
                    "stroke-width": borderWidth,
                    "rx": borderRadius,
                    "ry": borderRadius,
                };
                Object.keys(borderAttributes).forEach(attribute => {
                    border.setAttribute(attribute, borderAttributes[attribute]);
                });
                svg.appendChild(border);
            };
            currentQRCode.applyExtension(borderExtension);
        }
        
        currentQRCode.append(qrDisplay);

        // Hide spinner and show buttons after a short delay to ensure rendering
        setTimeout(() => {
            qrLoadingSpinner.classList.add('hidden');
            downloadBtn.classList.remove('hidden');
            copyBtn.classList.remove('hidden');
            downloadBtn.style.opacity = '1';
            copyBtn.style.opacity = '1';
            showToast('QR Code generated successfully!');
        }, 100); // Give a bit more time for rendering before hiding spinner
    }

    // Update download logic to use the new library's method
    downloadBtn.addEventListener('click', () => {
        if (currentQRCode) {
            currentQRCode.download({ name: "qrcode", extension: "png" });
            showToast('QR Code downloaded successfully!');
        } else {
            showToast('No QR Code to download.', 'error');
        }
    });

    copyBtn.addEventListener('click', () => {
        if (latestGeneratedText) {
            navigator.clipboard.writeText(latestGeneratedText)
                .then(() => showToast('Text copied to clipboard!'))
                .catch(err => showToast('Failed to copy text: ' + err, 'error'));
        } else {
            showToast('No text to copy.', 'error');
        }
    });

    // Event listeners for all options to regenerate QR code
    qrInput.addEventListener('input', generateQRCode);
    qrCodeType.addEventListener('change', () => {
        toggleInputSections(); // This also calls generateQRCode
    });
    qrSize.addEventListener('change', generateQRCode);
    qrErrorCorrection.addEventListener('change', generateQRCode);
    qrColorDark.addEventListener('input', generateQRCode);
    qrColorLight.addEventListener('input', generateQRCode);
    qrLogoFile.addEventListener('change', generateQRCode);
    qrLogoSize.addEventListener('input', generateQRCode);
    qrDotStyle.addEventListener('change', generateQRCode);
    qrCornersSquareStyle.addEventListener('change', generateQRCode);
    qrCornersDotStyle.addEventListener('change', generateQRCode);
    
    // Event listener for Dot Color Type to show/hide gradient options
    qrDotColorType.addEventListener('change', () => {
        if (qrDotColorType.value === 'gradient') {
            qrDotGradientOptions.classList.remove('hidden');
        } else {
            qrDotGradientOptions.classList.add('hidden');
        }
        generateQRCode();
    });

    // Event listeners for gradient options to regenerate QR code
    qrDotColorGradientType.addEventListener('change', generateQRCode);
    qrDotColorGradientRotation.addEventListener('input', generateQRCode);
    qrDotColorGradientStart.addEventListener('input', generateQRCode);
    qrDotColorGradientEnd.addEventListener('input', generateQRCode);

    // Event listener for border enabled checkbox
    qrBorderEnabled.addEventListener('change', () => {
        if (qrBorderEnabled.checked) {
            qrBorderOptions.classList.remove('hidden');
        } else {
            qrBorderOptions.classList.add('hidden');
        }
        generateQRCode();
    });

    // Event listeners for border options
    qrBorderColor.addEventListener('input', generateQRCode);
    qrBorderWidth.addEventListener('input', generateQRCode);
    qrBorderRadius.addEventListener('input', generateQRCode);

    // Initial call to set correct section visibility and generate QR code
    toggleInputSections();
    generateQRCode(); // Initial generation on page load
    
});

function loadAds() {
    // Simulate ad loading for development
    // In a real scenario, you'd load AdSense ads here
    // For example:
    // (adsbygoogle = window.adsbygoogle || []).push({});
}

// Load ads when the document is ready (if not already loaded by AdSense script)
document.addEventListener('DOMContentLoaded', loadAds);
