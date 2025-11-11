// استيراد كل ما نحتاجه من ملف الإعداد
import { 
  db, 
  analytics,
  auth,
  currentUserId,
  logEvent,
  getDoc, 
  doc, 
  setDoc,
  addDoc,
  collection,
  increment,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  runTransaction
} from './firebase-init.js';

document.addEventListener("DOMContentLoaded", () => {
    
    // قراءة "معرّف اللعبة" (ID) من الرابط (URL)
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    const container = document.getElementById("game-detail-container");

    if (!gameId) {
        container.innerHTML = "<h1>عذراً، لم يتم تحديد لعبة.</h1>";
        return;
    }

    // (جديد) مرجع للمستند في Firestore
    const gameDocRef = doc(db, "games", gameId);

    // --- (جديد) جلب بيانات اللعبة من Firestore ---
    async function fetchGameDetails() {
        try {
            container.innerHTML = "<h1>جاري تحميل بيانات اللعبة...</h1>";
            const docSnap = await getDoc(gameDocRef);

            if (docSnap.exists()) {
                const game = docSnap.data();
                displayGameData(game); // عرض بيانات اللعبة

                // (جديد) تسجيل مشاهدة الصفحة للتحليلات
                logEvent(analytics, 'view_item', {
                    item_id: gameId,
                    item_name: game.title,
                    item_category: game.genre
                });

            } else {
                container.innerHTML = "<h1>عذراً، لم يتم العثور على اللعبة.</h1>";
            }
        } catch (error) {
            console.error("Error fetching game details: ", error);
            container.innerHTML = "<h1>عذراً، حدث خطأ أثناء تحميل بيانات اللعبة.</h1>";
        }
    }

    // --- (جديد) دالة لملء الصفحة بالبيانات (مبنية على الكود الأصلي) ---
    function displayGameData(game) {
        document.title = `${game.title} - AZIZ STORE`; 

        // نفس الـ HTML من ملفك الأصلي مع تعديلات طفيفة
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
                        <li><strong>التقييم:</strong> <span id="game-rating">⭐ ${game.rating || 0} (${game.ratingCount || 0} تقييمات)</span></li>
                    </ul>
                    
                    <div class="purchase-box">
                        <span id="game-price" class="price">${game.price}</span>
                        <a href="${game.downloadUrl}" id="download-button" class="download-button" download>
                            تنزيل الآن
                        </a>
                        <p class="download-counter" style="color: #ccc; margin-top: 10px;">
                            مرات التنزيل: ${game.downloadCount || 0}
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
                        <p id="review-message" class="review-message" style="display: none;"></p>
                    </form>
                </div>
                
                <div class="comments-list-container">
                    <h3>التعليقات</h3>
                    <div id="comments-list">
                        <p>يتم تحميل التعليقات...</p>
                    </div>
                </div>
            </section>
        `;
        
        container.innerHTML = gameDetailHTML;

        // --- تفعيل الوظائف الإضافية بعد تحميل المحتوى ---
        activateDownloadButton(game.downloadUrl);
        activateReviewForm(); // تفعيل نظام النجوم والإرسال
        listenForComments(); // بدء الاستماع للتعليقات
    }

    // --- (جديد) تفعيل زر التنزيل (لتسجيل التحليلات وعدد التنزيلات) ---
    function activateDownloadButton(downloadUrl) {
        const downloadButton = document.getElementById("download-button");
        downloadButton.addEventListener("click", async (event) => {
            event.preventDefault(); // منع التحميل الفوري

            // 1. تسجيل التحليلات
            logEvent(analytics, 'select_content', {
                content_type: 'game_download',
                item_id: gameId
            });

            // 2. تحديث عدد التنزيلات في Firestore
            try {
                // استخدام setDoc مع merge + increment لتحديث العداد أو إنشائه
                await setDoc(gameDocRef, { 
                    downloadCount: increment(1) 
                }, { merge: true });

            } catch (error) {
                console.error("Error updating download count: ", error);
            }

            // 3. بدء التحميل يدوياً
            window.location.href = downloadUrl;
        });
    }

    // --- (جديد) تفعيل نظام النجوم ونموذج الإرسال (لحفظ التقييمات في Firestore) ---
    function activateReviewForm() {
        const reviewForm = document.getElementById("review-form");
        if (!reviewForm) return;
        
        const stars = reviewForm.querySelectorAll(".star-rating span");
        const ratingValueInput = reviewForm.querySelector("#star-rating-value");
        const commentText = reviewForm.querySelector("#comment-text");
        const submitButton = reviewForm.querySelector("button");
        const messageEl = reviewForm.querySelector("#review-message");

        // تفعيل النجوم (بنفس منطق الكود الأصلي)
        stars.forEach(star => {
            star.addEventListener("click", () => {
                const value = star.getAttribute("data-value");
                ratingValueInput.value = value;
                
                stars.forEach(s => s.classList.remove("selected"));
                for (let i = 0; i < value; i++) {
                    // الترتيب معكوس في HTML (من 5 إلى 1)
                    stars[4 - i].classList.add("selected");
                }
            });
        });

        // تفعيل إرسال النموذج (جديد)
        reviewForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            
            if (!auth.currentUser) {
                showMessage("حدث خطأ في المصادقة. يرجى إعادة تحميل الصفحة.", "error");
                return;
            }

            const userRating = parseInt(ratingValueInput.value);
            const userComment = commentText.value;

            if (userRating === 0) {
                showMessage("يرجى اختيار تقييم (النجوم) أولاً.", "error");
                return;
            }

            submitButton.disabled = true;
            showMessage("جاري إرسال التقييم...", "info");

            const newComment = {
                authorId: auth.currentUser.uid,
                author: "مستخدم", // يمكنك تغييره لاحقاً
                rating: userRating,
                text: userComment,
                createdAt: serverTimestamp() // استخدام وقت السيرفر
            };

            try {
                // (جديد) استخدام Transaction لتحديث التقييم وإضافة التعليق
                await runTransaction(db, async (transaction) => {
                    const gameDoc = await transaction.get(gameDocRef);
                    if (!gameDoc.exists()) {
                        throw "Game document does not exist!";
                    }

                    const gameData = gameDoc.data();
                    const oldRatingCount = gameData.ratingCount || 0;
                    const oldRatingSum = gameData.totalRatingSum || 0; 

                    const newRatingCount = oldRatingCount + 1;
                    const newRatingSum = oldRatingSum + userRating;
                    const newAverageRating = (newRatingSum / newRatingCount).toFixed(1);

                    // 1. تحديث مستند اللعبة الرئيسي
                    transaction.update(gameDocRef, {
                        ratingCount: newRatingCount,
                        totalRatingSum: newRatingSum,
                        rating: parseFloat(newAverageRating)
                    });

                    // 2. إضافة مستند التعليق الجديد
                    const newCommentRef = doc(collection(db, "games", gameId, "comments"));
                    transaction.set(newCommentRef, newComment);
                });

                showMessage("تم إرسال التقييم بنجاح!", "success");
                reviewForm.reset();
                stars.forEach(s => s.classList.remove("selected"));
                ratingValueInput.value = "0";

            } catch (error) {
                console.error("Error submitting review: ", error);
                showMessage("حدث خطأ أثناء إرسال التقييم.", "error");
            } finally {
                submitButton.disabled = false;
            }
        });

        function showMessage(text, type) {
            messageEl.textContent = text;
            messageEl.style.color = type === 'error' ? 'red' : (type === 'success' ? 'green' : 'white');
            messageEl.style.display = 'block';
            
            setTimeout(() => { 
                if (messageEl.textContent === text) {
                   messageEl.style.display = 'none'; 
                }
            }, 4000);
        }
    }

    // --- (جديد) الاستماع للتعليقات من Firestore (عرض فوري) ---
    function listenForComments() {
        const commentsListEl = document.getElementById("comments-list");
        const commentsQuery = query(collection(db, "games", gameId, "comments"), orderBy("createdAt", "desc"));

        onSnapshot(commentsQuery, (snapshot) => {
            if (snapshot.empty) {
                commentsListEl.innerHTML = "<p>لا توجد تعليقات حتى الآن. كن أول من يعلق!</p>";
                return;
            }

            commentsListEl.innerHTML = ""; // مسح القائمة قبل إعادة العرض
            snapshot.docs.forEach(doc => {
                const comment = doc.data();
                displayComment(comment, commentsListEl); // استخدام دالتك القديمة
            });
        }, (error) => {
            console.error("Error listening for comments: ", error);
            commentsListEl.innerHTML = "<p>حدث خطأ أثناء تحميل التعليقات.</p>";
        });
    }

    // --- دالة عرض تعليق واحد (من الكود الأصلي) ---
    function displayComment(comment, listElement) {
        const commentHTML = `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-rating">${"⭐".repeat(comment.rating)}</span>
                </div>
                <p class="comment-body">${comment.text}</p>
            </div>
        `;
        listElement.innerHTML += commentHTML;
    }

    // --- بدء العملية ---
    fetchGameDetails(); // ابدأ بجلب بيانات اللعبة
});
