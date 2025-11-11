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
    coverImage: "https://via.placeholder.com/300x150/007bff/ffffff?text=Game+Cover",
    screenshots: ["https://via.placeholder.com/800x450/007bff/ffffff?text=Screenshot+1", "https://via.placeholder.com/800x450/007bff/ffffff?text=Screenshot+2"],
    description: "لعبة مغامرات مثيرة في عالم مفتوح لاستكشاف الأراضي المجهولة ومحاربة الوحوش.",
    // تمت إضافة رابط التنزيل هنا
    downloadUrl: "nitro.zip", // <-- غيّر هذا إلى اسم ملفك الحقيقي
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
    coverImage: "https://via.placeholder.com/300x150/28a745/ffffff?text=Game+Cover",
    screenshots: ["https://via.placeholder.com/800x450/28a745/ffffff?text=Race+1"],
    description: "تحدى الجاذبية في سباقات سريعة عبر الكثبان الرملية.",
    // تمت إضافة رابط التنزيل هنا
    downloadUrl: "downloads/desert_race.zip", // <-- غيّر هذا إلى اسم ملفك الحقيقي
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
    coverImage: "https://via.placeholder.com/300x150/ffc107/000000?text=Game+Cover",
    screenshots: ["https://via.placeholder.com/800x450/ffc107/000000?text=Puzzle+1"],
    description: "حل ألغاز معقدة في بيئة فضائية مذهلة.",
    // تمت إضافة رابط التنزيل هنا
    downloadUrl: "downloads/space_puzzle.zip", // <-- غيّر هذا إلى اسم ملفك الحقيقي
    comments: []
  },
  {
    id: 4,
    title: "حرب النجوم",
    developer: "Galaxy Dev",
    genre: "أكشن",
    price: "$19.99",
    rating: 4.0,
    coverImage: "https://via.placeholder.com/300x150/dc3545/ffffff?text=Game+Cover",
    screenshots: ["https://via.placeholder.com/800x450/dc3545/ffffff?text=Action+1"],
    description: "قتال فضائي ملحمي للسيطرة على المجرة.",
    // تمت إضافة رابط التنزيل هنا
    downloadUrl: "downloads/star_wars.zip", // <-- غيّر هذا إلى اسم ملفك الحقيقي
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

            // محاكاة الإضافة الفورية
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

// *** تم حذف دالة "handleDownload" ***
// لم نعد بحاجة إليها لأن الرابط "<a>" يقوم بالمهمة مباشرة
