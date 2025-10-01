console.log("GalleryPage.js is loaded!");

class GalleryHandler {
    constructor() {
        console.log("Gallery handler initialized");
        this.filesArray = [];
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeElements();
    }
    
    initializeElements() {
        this.fileInput = document.getElementById("fileInput");
        this.previewList = document.getElementById("previewList");
        this.previewHeader = document.querySelector(".preview-header");
        this.totalSizeEl = document.getElementById("totalSize");
        
        console.log("Gallery elements initialized");
    }
    
    bindEvents() {
        const fileInput = document.getElementById("fileInput");
        
        if (fileInput) {
            fileInput.addEventListener("change", () => {
                this.filesArray = Array.from(fileInput.files);
                this.updatePreview();
            });
            console.log("File input event listener attached");
        }
    }
    
    updatePreview() {
        this.previewList.innerHTML = "";
        
        if (this.filesArray.length === 0) {
            this.previewHeader.textContent = "No files selected";
            this.totalSizeEl.textContent = "";
            return;
        }

        this.previewHeader.textContent = `${this.filesArray.length} file(s) selected`;
        let totalSize = 0;

        this.filesArray.forEach((file, index) => {
            totalSize += file.size;

            const item = document.createElement("div");
            item.classList.add("preview-item");

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "×";
            removeBtn.classList.add("remove-btn");
            removeBtn.onclick = () => {
                this.filesArray.splice(index, 1);
                this.updatePreview();
            };

            if (file.type.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                item.appendChild(img);
            } else if (file.type.startsWith("video/")) {
                const video = document.createElement("video");
                video.src = URL.createObjectURL(file);
                video.controls = false;
                item.appendChild(video);
            } else {
                item.textContent = file.name;
            }

            item.appendChild(removeBtn);
            this.previewList.appendChild(item);
        });

        this.totalSizeEl.textContent = `${(totalSize / (1024 * 1024)).toFixed(2)} MB total`;
    }
}

// Configuration for Gallery Page - AFTER THE CLASS
const PAGE_CONFIG = {
    pageName: 'Gallery',
    contentSelector: '.gallery-content',
    requiredElements: [
        '#fileInput',
        '#previewList', 
        '.preview-header',
        '#totalSize'
    ],
    initializationClass: 'GalleryHandler'
};

// Universal initialization function
function initializePage() {
    console.log(`Attempting to initialize ${PAGE_CONFIG.pageName}...`);

    const pageContent = document.querySelector(PAGE_CONFIG.contentSelector);
    
    if (!pageContent) {
        console.log(`${PAGE_CONFIG.pageName} content not loaded yet`);
        return false;
    }

    const missingElements = [];
    const foundElements = {};
    
    PAGE_CONFIG.requiredElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            foundElements[selector] = element;
            console.log(`${selector}: ✅ Found`);
        } else {
            missingElements.push(selector);
            console.log(`${selector}: ❌ Missing`);
        }
    });

    if (missingElements.length > 0) {
        console.log(`Missing elements for ${PAGE_CONFIG.pageName}:`, missingElements);
        return false;
    }

    console.log(`All required elements found - initializing ${PAGE_CONFIG.pageName}`);
    
    // Now GalleryHandler should be defined
    if (typeof GalleryHandler === 'function') {
        new GalleryHandler();
        return true;
    } else {
        console.error(`GalleryHandler class not found`);
        return false;
    }
}

// Rest of your initialization code stays the same...
const pageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const pageContent = document.querySelector(PAGE_CONFIG.contentSelector);
            if (pageContent && !window[`${PAGE_CONFIG.pageName}Initialized`]) {
                console.log(`${PAGE_CONFIG.pageName} content detected - initializing`);
                if (initializePage()) {
                    window[`${PAGE_CONFIG.pageName}Initialized`] = true;
                    pageObserver.disconnect();
                }
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    console.log(`DOM loaded - checking for ${PAGE_CONFIG.pageName} content`);
    
    if (initializePage()) {
        window[`${PAGE_CONFIG.pageName}Initialized`] = true;
    } else {
        console.log(`Starting observer for ${PAGE_CONFIG.pageName}`);
        pageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});

window[`initialize${PAGE_CONFIG.pageName}`] = function() {
    console.log(`Manual ${PAGE_CONFIG.pageName} initialization called`);
    if (!window[`${PAGE_CONFIG.pageName}Initialized`]) {
        if (initializePage()) {
            window[`${PAGE_CONFIG.pageName}Initialized`] = true;
            return true;
        }
    }
    return false;
};