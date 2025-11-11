// استيراد قاعدة البيانات من ملف الإعداد الجديد
import { db, getDocs, collection } from './firebase-init.js';

let allGames = []; // سيتم تخزين الألعاب من فايرستور هنا

document.addEventListener("DOMContentLoaded", async () => {
    
    const gameGrid = document.getElementById("game-grid");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const featuredBanner = document.querySelector(".featured-banner");
    
    // مؤشر تحميل مؤقت
    gameGrid.innerHTML = "<p>يتم تحميل الألعاب من قاعدة البيانات...</p>";

    // --- (جديد) جلب الألعاب من Firestore ---
    async function fetchAndDisplayGames() {
        try {
            // جلب مستندات الألعاب من مجموعة "games"
            const querySnapshot = await getDocs(collection(db, "games"));
            // تحويل البيانات + إضافة ID المستند
            allGames = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            if (allGames.length === 0) {
                gameGrid.innerHTML = "<p>لم يتم العثور على ألعاب. يرجى إضافتها في لوحة تحكم Firestore.</p>";
            } else {
                displayGames(allGames);
                // تحديث اللعبة المميزة بعد جلب البيانات
                setupFeaturedGame();
            }
        } catch (error) {
            console.error("Error fetching games: ", error);
            gameGrid.innerHTML = "<p>حدث خطأ أثناء تحميل الألعاب. تأكد من إعدادات الأمان في Firestore.</p>";
        }
    }

    // (جديد) دالة لإعداد اللعبة المميزة (بنفس المنطق القديم)
    function setupFeaturedGame() {
        // البحث عن اللعبة التي لها ID "1" (كما في الكود الأصلي)
        const featuredGame = allGames.find(game => game.id === '1'); 
        
        if (featuredGame && featuredBanner) {
            // استخدام المسار الأصلي للعبة المميزة "momiz"
            const featuredHTML = `
                <a href="game.html?id=${featuredGame.id}" class="featured-link">
                    <img src="images/momiz/1.webp" alt="${featuredGame.title}">
                    <div class="featured-info">
                        <h2>${featuredGame.title}</h2>
                        <p>${featuredGame.description}</p>
                        <span>اكتشف المزيد...</span>
                    </div>
                </a>
            `;
            featuredBanner.innerHTML = featuredHTML;
        }
    }

    // دالة عرض الألعاب (معدلة لتستخدم بيانات Firestore)
    function displayGames(gamesList) {
        gameGrid.innerHTML = "";
        
        if (gamesList.length === 0) {
            gameGrid.innerHTML = "<p>لا توجد ألعاب تطابق هذا البحث.</p>";
            return;
        }

        gamesList.forEach(game => {
            const gameCardHTML = `
                <a href="game.html?id=${game.id}" class="game-card-link">
                    <div class="game-card">
                        <img src="${game.coverImage}" alt="${game.title} Cover">
                        <div class="game-card-content">
                            <h3>${game.title}</h3>
                            <p>المطور: ${game.developer}</p>
                            <div class="game-card-footer">
                                <span class="price">${game.price}</span>
                                <span class="rating">⭐ ${game.rating || 0}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            gameGrid.innerHTML += gameCardHTML;
        });
    }

    // جلب الألعاب عند التحميل
    fetchAndDisplayGames();

    // تفعيل البحث (يعمل على allGames التي تم جلبها)
    searchInput.addEventListener("keyup", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        const filteredGames = allGames.filter(game => {
            return game.title.toLowerCase().includes(searchTerm);
        });
        
        displayGames(filteredGames);
    });

    // تفعيل الفلاتر (يعمل على allGames التي تم جلبها)
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");
            let filteredGames = [];

            if (filterValue === "all") {
                filteredGames = allGames;
            } else if (filterValue === "free") {
                filteredGames = allGames.filter(game => game.price.toLowerCase() === "مجاني");
            } else {
                filteredGames = allGames.filter(game => game.genre === filterValue);
            }
            
            displayGames(filteredGames);
        });
    });
});
