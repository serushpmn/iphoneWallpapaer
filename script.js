document.addEventListener('DOMContentLoaded', () => {
    const imageGrid = document.getElementById('imageGrid');
    const backgroundImg = document.getElementById('backgroundImg');
    const textInput = document.getElementById('textInput');
    const textOverlay = document.getElementById('textOverlay');
    const fontSizeControl = document.getElementById('fontSize');
    const textColorControl = document.getElementById('textColor');
    const fontFamilyControl = document.getElementById('fontFamily');
    const wallpaperContainer = document.getElementById('wallpaperContainer');
    const downloadBtn = document.getElementById('downloadBtn');

    // آرایه‌ای از آدرس ۱۰ عکس پیش‌فرض
    const wallpapers = [
        'images/wallpaper1.jpg',
        'images/wallpaper2.jpg',
        'images/wallpaper3.jpg',
        'images/wallpaper4.jpg',
        'images/wallpaper5.jpg',
        'images/wallpaper6.jpg',
        'images/wallpaper7.jpg',
        'images/wallpaper8.jpg',
        'images/wallpaper9.jpg',
        'images/wallpaper10.jpg',
    ];

    // ۱. بارگذاری تصاویر پیش‌فرض
    function loadImages() {
        wallpapers.forEach((src, index) => {
            const imgItem = document.createElement('div');
            imgItem.classList.add('image-item');
            imgItem.dataset.src = src; // آدرس عکس را در data-src ذخیره می‌کنیم

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Wallpaper ${index + 1}`;
            imgItem.appendChild(img);

            // انتخاب عکس
            imgItem.addEventListener('click', () => {
                // حذف کلاس 'selected' از تمام آیتم‌ها
                document.querySelectorAll('.image-item').forEach(item => {
                    item.classList.remove('selected');
                });
                // اضافه کردن کلاس 'selected' به آیتم فعلی
                imgItem.classList.add('selected');
                backgroundImg.src = src; // تنظیم عکس پس‌زمینه در پیش‌نمایش
            });
            imageGrid.appendChild(imgItem);
        });

        // انتخاب اولین عکس به عنوان پیش‌فرض
        if (wallpapers.length > 0) {
            document.querySelector('.image-item').click();
        }
    }

    // ۲. به‌روزرسانی متن و استایل‌ها
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

    // ۳. قابلیت کشیدن و رها کردن (Drag and Drop) برای متن
    let isDragging = false;
    let offsetX, offsetY;

    textOverlay.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // فقط با کلیک چپ ماوس
            isDragging = true;
            // محاسبه موقعیت ماوس نسبت به عنصر متن (نه نسبت به صفحه)
            const rect = textOverlay.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            textOverlay.style.cursor = 'grabbing';
            textOverlay.style.userSelect = 'none'; // جلوگیری از انتخاب متن در حین درگ
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // محاسبه موقعیت جدید متن نسبت به کانتینر والد
        const containerRect = wallpaperContainer.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - offsetX;
        let newY = e.clientY - containerRect.top - offsetY;

        // محدود کردن متن داخل کانتینر
        newX = Math.max(0, Math.min(newX, containerRect.width - textOverlay.offsetWidth));
        newY = Math.max(0, Math.min(newY, containerRect.height - textOverlay.offsetHeight));

        textOverlay.style.left = `${newX}px`;
        textOverlay.style.top = `${newY}px`;
        textOverlay.style.transform = 'none'; // چون top/left رو دستی تنظیم می‌کنیم
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        textOverlay.style.cursor = 'grab';
        textOverlay.style.userSelect = 'auto'; // فعال کردن مجدد انتخاب متن
    });

    // ۴. دانلود والپیپر
    downloadBtn.addEventListener('click', () => {
        // مخفی کردن موقتی دکمه‌ها و عناصر کنترلی برای اسکرین‌شات تمیز
        const originalDisplay = downloadBtn.style.display;
        downloadBtn.style.display = 'none';
        
        // اطمینان از اینکه تصاویر کاملاً لود شده‌اند (مهم برای html2canvas)
        // اگر عکس به صورت لوکال بارگذاری شده و CORS مشکلی ایجاد نکنه، معمولا نیازی به allowTaint نیست
        html2canvas(wallpaperContainer, {
            useCORS: true, // اگر تصاویر از دامنه‌های دیگر باشند
            allowTaint: true, // اگر تصاویر از دامنه‌های دیگر باشند و نیاز به پردازش CORS دارند
            logging: true, // برای دیباگ کردن مشکلات
            scale: 2 // افزایش کیفیت خروجی (2 برابر اندازه اصلی پیش‌نمایش)
        }).then(canvas => {
            // نمایش مجدد دکمه دانلود
            downloadBtn.style.display = originalDisplay;

            const imageUrl = canvas.toDataURL('image/png'); // تبدیل Canvas به عکس PNG

            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'my-mobile-wallpaper.png'; // نام فایل دانلود شده
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(error => {
            console.error('Oops, something went wrong!', error);
            alert('متاسفانه در ساخت والپیپر مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
            downloadBtn.style.display = originalDisplay; // نمایش مجدد دکمه در صورت خطا
        });
    });

    // فراخوانی تابع بارگذاری عکس‌ها هنگام بارگذاری صفحه
    loadImages();

    // تنظیم اولیه متن روی پیش‌نمایش (با متن پیش‌فرض input)
    textOverlay.textContent = textInput.value;
    textOverlay.style.fontSize = `${fontSizeControl.value}px`;
    textOverlay.style.color = textColorControl.value;
    textOverlay.style.fontFamily = fontFamilyControl.value;
});
// فایل script.js

// ... کدهای قبلی ...

    // ۴. دانلود والپیپر
    downloadBtn.addEventListener('click', () => {
        const originalDisplay = downloadBtn.style.display;
        downloadBtn.style.display = 'none';

        // محاسبه ابعاد واقعی (target resolution) و ابعاد فعلی کانتینر
        const targetWidth = 1170;
        const targetHeight = 2532;
        
        // این مقادیر رو از استایل‌های CSS فعلی کانتینر می‌گیریم.
        // اگر در مدیا کوئری باشیم، اینها ابعاد کوچک‌شده خواهند بود.
        const currentContainerWidth = wallpaperContainer.offsetWidth;
        const currentContainerHeight = wallpaperContainer.offsetHeight;

        // محاسبه scale factor
        // این scale factor به html2canvas می‌گه که پیش‌نمایش رو چند برابر بزرگ‌تر کنه تا به رزولوشن هدف برسه.
        const scaleX = targetWidth / currentContainerWidth;
        const scaleY = targetHeight / currentContainerHeight;
        const finalScale = Math.max(scaleX, scaleY); // از بزرگترین مقیاس استفاده می‌کنیم تا کیفیت حفظ بشه

        html2canvas(wallpaperContainer, {
            useCORS: true,
            allowTaint: true,
            logging: true,
            scale: finalScale, // استفاده از scale factor محاسبه شده
            width: targetWidth, // تنظیم عرض خروجی نهایی به 1170
            height: targetHeight // تنظیم ارتفاع خروجی نهایی به 2532
        }).then(canvas => {
            downloadBtn.style.display = originalDisplay;

            const imageUrl = canvas.toDataURL('image/png');

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

// ... کدهای قبلی ...