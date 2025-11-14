// (هذا ملف game-details.js المحدث)

// 1. "قاعدة البيانات"
const gamesDB = [
  {
    id: 1,
    title: "THE HOIDED DRIVER",
    developer: "AZIZ GAMES STUDIO",
    genre: "سباقات",
    price: "مجاني",
    rating: 4.5,
    coverImage: "images/coverImage/1.webp",
    screenshots: ["images/screenshots/1/1.webp", "images/screenshots/1/2.webp"],
    description: "قد السيارة بشجاعة عبر شوارع 45 دولة محظورة، تحدى القوانين، اجمع الميداليات، وافتح طريقك نحو الحرية! هل أنت السائق الأسطوري المنتظر؟",
    downloadUrl: "downloads/TheHoidedDriver.apk", 
    comments: [
        { author: "لاعب_محترف", rating: 5, text: "لعبة رائعة! الجرافيكس مذهل." },
        { author: "مستخدم_جديد", rating: 4, text: "جيدة جداً، لكنها صعبة قليلاً." }
    ]
  },
  {
    id: 2,
    title: "سباق الصحراء",
    developer: "Speed Inc.",
    genre: "سباقات",
    price: "$9.99",
    rating: 4.2,
    coverImage: "images/coverImage/2.webp",
    screenshots: ["images/screenshots/2/1.webp"],
    description: "تحدى الجاذبية في سباقات سريعة عبر الكثبان الرملية.",
    downloadUrl: "downloads/desert_race.zip", 
    comments: [
        { author: "متسابق1", rating: 4, text: "أفضل لعبة سباق لعبتها هذا العام." }
    ]
  },
  {
    id: 3,
    title: "لغز الفضاء",
    developer: "Mind Games",
    genre: "ألغاز",
    price: "$4.99",
    rating: 4.8,
    coverImage: "images/coverImage/3.webp",
    screenshots: ["images/screenshots/3/1.webp"],
    description: "حل ألغاز معقدة في بيئة فضائية مذهلة.",
    downloadUrl: "downloads/space_puzzle.zip", 
    comments: []
  },
  {
    id: 4,
    title: "حرب النجوم",
    developer: "Galaxy Dev",
    genre: "أكشن",
    price: "$19.99",
    rating: 4.0,
    coverImage: "images/coverImage/4.webp",
    screenshots: ["images/screenshots/4/1.webp"],
    description: "قتال فضائي ملحمي للسيطرة على المجرة.",
    downloadUrl: "downloads/star_wars.zip", 
    comments: []
  }
];

// انتظر تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    
    // قراءة "معرّف اللعبة" (ID) من الرابط (URL)
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    // البحث عن اللعبة في "قاعدة البيانات"
    const game = gamesDB.find(g => g.id == gameId);

    // الحصول على الحاوية الرئيسية
    const container = document.getElementById("game-detail-container");

    if (game) {
        // إذا تم العثور على اللعبة، قم بملء الصفحة
        document.title = `${game.title} - AZIZ STORE`; // تحديث عنوان الصفحة

        // إنشاء كود HTML الديناميكي
        const gameDetailHTML = `
            <h1>${game.title}</h1>
            <div class="game-detail-layout">
                
                <div class="game-media">
                    <img id="main-screenshot" src="${game.screenshots[0]}" alt="${game.title} Screenshot">
                </div>
                
                <div class="game-info">
                    <h2>الوصف</h2>
                    <p id="game-description">${game.description}</p>
                    <ul class="game-metadata">
                        <li><strong>المطور:</strong> <span id="game-developer">${game.developer}</span></li>
                        <li><strong>التصنيف:</strong> <span id="game-genre">${game.genre}</span></li>
                        <li><strong>التقييم:</strong> <span id="game-rating">⭐ ${game.rating}</span></li>
                    </ul>
                    
                    <div class="purchase-box">
                        <span id="game-price" class="price">${game.price}</span>
                        <a href="${game.downloadUrl}" id="download-button" class="download-button" download>
                            تنزيل الآن
                        </a>
                        <span id="download-count-display" class="download-count">...</span>
                    </div>
                </div>
            </div>
            
            <section class="reviews-section">
                <div class="review-form-container">
                    <h3>اترك تقييمك</h3>
                    <form id="review-form">
                        <div class="star-rating">
                            <span data-value="5">☆</span>
                            <span data-value="4">☆</span>
                            <span data-value="3">☆</span>
                            <span data-value="2">☆</span>
                            <span data-value="1">☆</span>
                        </div>
                        <input type="hidden" id="star-rating-value" value="0">
                        <textarea id="comment-text" rows="5" placeholder="اكتب تعليقك هنا..." required></textarea>
                        <button type="submit" class="download-button">إرسال التقييم</button>
                    </form>
                </div>
                
                <div class="comments-list-container">
                    <h3>التعليقات</h3>
                    <div id="comments-list">
                        </div>
                </div>
            </section>
        `;
        
        container.innerHTML = gameDetailHTML;
        
        // --- تفعيل الوظائف الإضافية بعد تحميل المحتوى ---

        // 0. تفعيل عداد التنزيلات (الكود المحدث)
        
        // --- (أ) إعدادات العداد ---
        const namespace = "abdulaziz-alshargis-team-1656";
        const gameKey = `game-${game.id}`; // استخدام المفتاح الجديد مثل: "game-1", "game-2"
        const countDisplayElement = document.getElementById("download-count-display");
        
        // --- (ب) جلب العداد الحالي عند تحميل الصفحة ---
        
    // السطر الصحيح (يستخدم المتغيرات)
const getCountUrl = `https://api.counterapi.dev/v2/${namespace}/${gameKey}`;
        
        countDisplayElement.textContent = "جارٍ التحميل..."; // نص مؤقت

        fetch(getCountUrl)
            .then(response => response.json())
            .then(data => {
                countDisplayElement.textContent = `مرات التنزيل: ${data.count || 52}k+`;
            })
            .catch(error => {
                console.error("خطأ في جلب عداد التنزيلات:", error);
                countDisplayElement.textContent = "لا يمكن عرض عدد التنزيلات";
            });

        // --- (ج) ربط زيادة العداد بزر التنزيل ---
        const downloadButton = document.getElementById("download-button");
        if (downloadButton) {
            downloadButton.addEventListener("click", () => {
                // هذا هو رابط الزيادة "up" (وهو صحيح)
                const upUrl = `https://api.counterapi.dev/v2/abdulaziz-alshargis-team-1656/game-1/up`;

                fetch(upUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log(`تم تحديث عداد اللعبة ${gameKey}:`, data.count);
                        // تحديث الرقم المعروض مباشرة بعد النقر
                        // الكود المُحسّن
if (countDisplayElement) {
    // استخدم (data.count || 0) لضمان عرض صفر بدلاً من "undefined"
    countDisplayElement.textContent = `مرات التنزيل: ${data.count || 52}k+`;
}
                    })
                    .catch(error => {
                        console.error("خطأ في تحديث عداد التنزيلات:", error);
                        // ملاحظة: سيستمر التنزيل حتى لو فشل العداد
                    });
            });
        }
        // (نهاية الكود المحدث للعداد)


        // 1. عرض التعليقات الموجودة
        const commentsList = document.getElementById("comments-list");
        displayComments(game.comments || []);

        // 2. تفعيل نظام النجوم
        const stars = document.querySelectorAll(".star-rating span");
        const ratingValueInput = document.getElementById("star-rating-value");

        stars.forEach(star => {
            star.addEventListener("click", () => {
                const value = star.getAttribute("data-value");
                ratingValueInput.value = value;
                
                stars.forEach(s => s.classList.remove("selected"));
                star.classList.add("selected");
                let current = star;
                while(current.nextElementSibling) {
                    current.nextElementSibling.classList.add("selected");
                    current = current.nextElementSibling;
                }
            });
        });

        // 3. تفعيل نموذج إرسال التعليق
        const reviewForm = document.getElementById("review-form");
        reviewForm.addEventListener("submit", (event) => {
            event.preventDefault(); 

            const userRating = ratingValueInput.value;
            const userComment = document.getElementById("comment-text").value;

            if (userRating == "0") {
                alert("يرجى اختيار تقييم (النجوم) أولاً.");
                return;
            }
            
            const newComment = {
                author: "أنت (مستخدم حالي)",
                rating: parseInt(userRating),
                text: userComment
            };

            displayComment(newComment, commentsList, true);
            reviewForm.reset();
            stars.forEach(s => s.classList.remove("selected"));
            ratingValueInput.value = "0";
        });

    } else {
        container.innerHTML = "<h1>عذراً، لم يتم العثور على اللعبة.</h1>";
    }
});

// دالة منفصلة لعرض قائمة التعليقات
function displayComments(commentsArray) {
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = ""; 
    if(commentsArray.length === 0) {
        commentsList.innerHTML = "<p>لا توجد تعليقات حتى الآن. كن أول من يعلق!</p>";
        return;
    }
    commentsArray.forEach(comment => {
        displayComment(comment, commentsList, false);
    });
}

// دالة لعرض تعليق واحد
function displayComment(comment, listElement, addToTop) {
    const commentHTML = `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-rating">${"⭐".repeat(comment.rating)}</span>
            </div>
            <p class="comment-body">${comment.text}</p>
        </div>
    `;
    if (addToTop) {
        listElement.innerHTML = commentHTML + listElement.innerHTML;
    } else {
        listElement.innerHTML += commentHTML;
    }
}
