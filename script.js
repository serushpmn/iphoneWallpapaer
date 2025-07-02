document.addEventListener('DOMContentLoaded', () => {
    // ... (کدهای اولیه شما بدون تغییر) ...
    const imageGrid = document.getElementById('imageGrid');
    const backgroundImg = document.getElementById('backgroundImg');
    const textInput = document.getElementById('textInput');
    const textOverlay = document.getElementById('textOverlay');
    const fontSizeControl = document.getElementById('fontSize');
    const textColorControl = document.getElementById('textColor');
    const fontFamilyControl = document.getElementById('fontFamily');
    const wallpaperContainer = document.getElementById('wallpaperContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const container = document.querySelector('.container');

    const wallpapers = [
        'images/wallpaper1.jpg', 'images/wallpaper2.jpg', 'images/wallpaper3.jpg',
        'images/wallpaper4.jpg', 'images/wallpaper5.jpg', 'images/wallpaper6.jpg',
        'images/wallpaper7.jpg', 'images/wallpaper8.jpg', 'images/wallpaper9.jpg',
        'images/wallpaper10.jpg',
    ];

    function loadImages() {
        // ... (همانند کد قبلی شما) ...
        wallpapers.forEach((src, index) => {
            const imgItem = document.createElement('div');
            imgItem.classList.add('image-item');
            imgItem.dataset.src = src;

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Wallpaper ${index + 1}`;
            imgItem.appendChild(img);

            imgItem.addEventListener('click', () => {
                document.querySelectorAll('.image-item').forEach(item => {
                    item.classList.remove('selected');
                });
                imgItem.classList.add('selected');
                backgroundImg.src = src;
            });
            imageGrid.appendChild(imgItem);
        });

        if (wallpapers.length > 0) {
            document.querySelector('.image-item').click();
        }
    }

    textInput.addEventListener('input', (e) => {
        textOverlay.textContent = e.target.value;
    });

    fontSizeControl.addEventListener('input', (e) => {
        textOverlay.style.fontSize = `${e.target.value}px`;
    });

    textColorControl.addEventListener('input', (e) => {
        textOverlay.style.color = e.target.value;
    });

    fontFamilyControl.addEventListener('change', (e) => {
        textOverlay.style.fontFamily = e.target.value;
    });

    // ... (بخش Drag and Drop بدون تغییر) ...
    let isDragging = false;
    let offsetX, offsetY;

    textOverlay.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            isDragging = true;
            const rect = textOverlay.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            textOverlay.style.cursor = 'grabbing';
            textOverlay.style.userSelect = 'none';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const containerRect = wallpaperContainer.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - offsetX;
        let newY = e.clientY - containerRect.top - offsetY;

        newX = Math.max(0, Math.min(newX, containerRect.width - textOverlay.offsetWidth));
        newY = Math.max(0, Math.min(newY, containerRect.height - textOverlay.offsetHeight));

        textOverlay.style.left = `${(newX / containerRect.width) * 100}%`;
        textOverlay.style.top = `${(newY / containerRect.height) * 100}%`;
        textOverlay.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        textOverlay.style.cursor = 'grab';
        textOverlay.style.userSelect = 'auto';
    });


    function adjustWallpaperContainerSize() {
        const wallpaperAspectRatio = 1170 / 2532; // عرض / ارتفاع
        
        // این مقادیر رو از استایل‌های CSS فعلی کانتینر می‌گیریم.
        // اگر در مدیا کوئری باشیم، اینها ابعاد کوچک‌شده خواهند بود.
        const headerHeight = document.querySelector('h1').offsetHeight;
        const imageSelectionHeight = document.querySelector('.image-selection').offsetHeight;
        const textInputSectionHeight = document.querySelector('.text-input-section').offsetHeight;
        const instructionHeight = document.querySelector('.instruction').offsetHeight;
        const downloadBtnHeight = downloadBtn.offsetHeight;
        
        // 150px برای حاشیه‌ها و فاصله بین بخش‌ها. این عدد را دقیق‌تر کنید.
        const reservedSpace = headerHeight + imageSelectionHeight + textInputSectionHeight + instructionHeight + downloadBtnHeight + 150; 

        const availableHeight = window.innerHeight - reservedSpace;
        const availableWidth = container.offsetWidth;
        
        let newHeight = availableHeight;
        let newWidth = newHeight * wallpaperAspectRatio;

        if (newWidth > availableWidth) {
            newWidth = availableWidth;
            newHeight = newWidth / wallpaperAspectRatio;
        }

        const maxPreviewHeight = 600;
        const minPreviewHeight = 300; 

        newHeight = Math.min(newHeight, maxPreviewHeight);
        newHeight = Math.max(newHeight, minPreviewHeight);
        newWidth = newHeight * wallpaperAspectRatio;

        wallpaperContainer.style.width = `${newWidth}px`;
        wallpaperContainer.style.height = `${newHeight}px`;

        const currentLeft = parseFloat(textOverlay.style.left) || 5;
        const currentTop = parseFloat(textOverlay.style.top) || 55;
        
        textOverlay.style.left = `${currentLeft}%`;
        textOverlay.style.top = `${currentTop}%`;
        textOverlay.style.transform = 'none';
    }


    // ۴. دانلود والپیپر - تغییرات اصلی اینجا اعمال می‌شوند
    downloadBtn.addEventListener('click', () => {
        const originalDisplay = downloadBtn.style.display;
        downloadBtn.style.display = 'none';

        // ابعاد هدف نهایی برای والپیپر
        const targetWidth = 1170;
        const targetHeight = 2532;

        // ابعاد فعلی نمایش داده شده کانتینر والپیپر
        const currentContainerWidth = wallpaperContainer.offsetWidth;
        const currentContainerHeight = wallpaperContainer.offsetHeight;

        const scaleX = targetWidth / currentContainerWidth;
        const scaleY = targetHeight / currentContainerHeight;
        const finalScale = Math.max(scaleX, scaleY); // استفاده از بزرگترین مقیاس برای اطمینان از پوشش کامل و عدم افت کیفیت

        html2canvas(wallpaperContainer, {
            useCORS: true,
            allowTaint: true,
            logging: true,
            scale: finalScale,
         
        }).then(canvas => {
            downloadBtn.style.display = originalDisplay;

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = targetWidth;
            finalCanvas.height = targetHeight;
            const ctx = finalCanvas.getContext('2d');

            // محاسبه ابعاد و موقعیت برای کشیدن تصویر از canvas اولیه به finalCanvas
            // این اطمینان می‌دهد که نسبت ابعاد حفظ شده و تصویر با بهترین کیفیت ممکن جا شود.
            const sourceAspectRatio = canvas.width / canvas.height;
            const targetAspectRatio = targetWidth / targetHeight;

            let sx, sy, sWidth, sHeight; // source rectangle
            let dx, dy, dWidth, dHeight; // destination rectangle

            if (sourceAspectRatio > targetAspectRatio) {
                // منبع عریض‌تر از هدف است، پس باید از عرض منبع برش بزنیم
                sHeight = canvas.height;
                sWidth = sHeight * targetAspectRatio;
                sx = (canvas.width - sWidth) / 2;
                sy = 0;
            } else {
                // منبع بلندتر از هدف است، پس باید از ارتفاع منبع برش بزنیم
                sWidth = canvas.width;
                sHeight = sWidth / targetAspectRatio;
                sx = 0;
                sy = (canvas.height - sHeight) / 2;
            }

            dx = 0;
            dy = 0;
            dWidth = targetWidth;
            dHeight = targetHeight;

            ctx.drawImage(canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

            // حالا از finalCanvas برای دانلود استفاده می‌کنیم
            const imageUrl = finalCanvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'my-iphone-wallpaper.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(error => {
            console.error('Oops, something went wrong!', error);
            alert('متاسفانه در ساخت والپیپر مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
            downloadBtn.style.display = originalDisplay;
        });
    });

    loadImages();
    textOverlay.textContent = textInput.value;
    textOverlay.style.fontSize = `${fontSizeControl.value}px`;
    textOverlay.style.color = textColorControl.value;
    textOverlay.style.fontFamily = fontFamilyControl.value;

    adjustWallpaperContainerSize();
    window.addEventListener('resize', adjustWallpaperContainerSize);
});