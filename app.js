// 1. "قاعدة البيانات" المؤقتة (تم إضافة "description")
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
  //باقي الالعاب هنا وأضافة قوس لكل الالعاب بنقطة},
  }
];


document.addEventListener("DOMContentLoaded", () => {
    
    const gameGrid = document.getElementById("game-grid");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // --- (جديد) كود عرض اللعبة المميزة ---
    const featuredBanner = document.querySelector(".featured-banner");
    
    // لنفترض أن اللعبة المميزة هي دائماً أول لعبة (id: 1)
    const featuredGame = gamesDB.find(game => game.id === 1); 
    
    if (featuredGame) {
        // استخدمنا مسار "momiz" الذي طلبته
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
        // قمنا بإزالة العنوان "اللعبة المميزة" من HTML واعتمدنا هذا الكود
        featuredBanner.innerHTML = featuredHTML;
    }
    // --- نهاية الكود الجديد ---


    // دالة عرض الألعاب
    function displayGames(gamesList) {
        // ... (باقي الكود كما هو) ...
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
                                <span class="rating">⭐ ${game.rating}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            gameGrid.innerHTML += gameCardHTML;
        });
    }

    // عرض جميع الألعاب عند التحميل
    displayGames(gamesDB);

    // تفعيل البحث
    searchInput.addEventListener("keyup", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        const filteredGames = gamesDB.filter(game => {
            return game.title.toLowerCase().includes(searchTerm);
        });
        
        displayGames(filteredGames);
    });

    // تفعيل الفلاتر
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");
            let filteredGames = [];

            if (filterValue === "all") {
                filteredGames = gamesDB;
            } else if (filterValue === "free") {
                filteredGames = gamesDB.filter(game => game.price.toLowerCase() === "مجاني");
            } else {
                filteredGames = gamesDB.filter(game => game.genre === filterValue);
            }
            
            displayGames(filteredGames);
        });
    });
});
