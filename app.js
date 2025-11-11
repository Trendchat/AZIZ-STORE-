// 1. "قاعدة البيانات" المؤقتة (لبيانات البطاقة فقط)
const gamesDB = [
  {
    id: 1,
    title: "مغامرة البطل",
    developer: "Studio X",
    genre: "مغامرات",
    price: "مجاني",
    rating: 4.5,
    coverImage: "https://via.placeholder.com/300x150/007bff/ffffff?text=Game+Cover"
  },
  {
    id: 2,
    title: "سباق الصحراء",
    developer: "Speed Inc.",
    genre: "سباقات",
    price: "$9.99",
    rating: 4.2,
    coverImage: "https://via.placeholder.com/300x150/28a745/ffffff?text=Game+Cover"
  },
  {
    id: 3,
    title: "لغز الفضاء",
    developer: "Mind Games",
    genre: "ألغاز",
    price: "$4.99",
    rating: 4.8,
    coverImage: "https://via.placeholder.com/300x150/ffc107/000000?text=Game+Cover"
  },
  {
    id: 4,
    title: "حرب النجوم",
    developer: "Galaxy Dev",
    genre: "أكشن",
    price: "$19.99",
    rating: 4.0,
    coverImage: "https://via.placeholder.com/300x150/dc3545/ffffff?text=Game+Cover"
  }
];


document.addEventListener("DOMContentLoaded", () => {
    
    const gameGrid = document.getElementById("game-grid");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filter-btn"); // الحصول على أزرار الفلاتر

    // دالة عرض الألعاب
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
