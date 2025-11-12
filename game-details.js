// (هذا ملف game-details.js المحدث)

// 1. "قاعدة البيانات" (تم إضافة "downloadUrl" لكل لعبة)
const gamesDB = [
  {
    id: 1,
    title: "مغامرة البطل",
    developer: "Studio X",
    genre: "مغامرات",
    price: "مجاني",
    rating: 4.5,
    coverImage: "images/coverImage/1.webp",
    screenshots: ["images/screenshots/1/1.webp", "images/screenshots/1/2.webp"],
    description: "لعبة مغامرات مثيرة في عالم مفتوح لاستكشاف الأراضي المجهولة ومحاربة الوحوش.",
    downloadUrl: "nitro.zip", 
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
                        <p style="text-align: center; margin-top: 10px; color: #ccc;">
                            <span id="download-count">...</span> تنزيلات
                        </p>
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
        
        // --- (جديد) كود تتبع التنزيلات ---

        // (أ) تعريف العدادات
        const countNamespace = "azizstore"; // يمكنك تغييره لأي اسم (مثل اسم متجرك)
        const countKey = `game-${game.id}`; // مفتاح فريد لكل لعبة
        const downloadButton = document.getElementById("download-button");
        const downloadUrl = downloadButton.href;
        const downloadCountSpan = document.getElementById("download-count");

        // (ب) دالة لجلب العداد عند تحميل الصفحة
        function getDownloadCount() {
            fetch(`https://api.counterapi.dev/v2/abdulaziz-alshargis-team-1656/1game/up \
  -H "Authorization: Bearer ut_dDfcrrl9r2mg6ZJSQzLurHj82LehXkWQtDplIbrY"`)
                .then(response => response.json())
                .then(data => {
                    downloadCountSpan.textContent = data.value || 0; // عرض القيمة أو 0
                })
                .catch(error => {
                    console.error("خطأ في جلب العداد:", error);
                    downloadCountSpan.textContent = "N/A";
                });
        }

        // (ج) دالة لزيادة العداد عند الضغط
        function incrementDownloadCount(event) {
            // 1. منع التنزيل الفوري
            event.preventDefault(); 
            
            downloadButton.textContent = "جاري التحضير...";
            downloadButton.disabled = true;

            // 2. إرسال طلب لزيادة العداد
            fetch(`https://api.counterapi.dev/v2/abdulaziz-alshargis-team-1656/1game/up \
  -H "Authorization: Bearer ut_dDfcrrl9r2mg6ZJSQzLurHj82LehXkWQtDplIbrY"`)
                .then(response => response.json())
                .then(data => {
                    // 3. تحديث الرقم في الصفحة
                    downloadCountSpan.textContent = data.value;
                    console.log(`تم تسجيل التنزيل! العدد الإجمالي: ${data.value}`);
                })
                .catch(error => {
                    console.error("خطأ في تحديث العداد:", error);
                })
                .finally(() => {
                    // 4. سواء نجح العداد أم لا، ابدأ التنزيل
                    window.location.href = downloadUrl;
                    downloadButton.textContent = "تنزيل الآن";
                    downloadButton.disabled = false;
                });
        }

        // (د) تفعيل الوظائف
        getDownloadCount(); // جلب العداد عند فتح الصفحة
        downloadButton.addEventListener("click", incrementDownloadCount); // تفعيل الزر

        // --- نهاية كود تتبع التنزيلات ---


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
