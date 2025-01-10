document.getElementById('searchButton').addEventListener('click', function () {
    const searchText = document.getElementById('searchInput').value.trim();
    if (searchText) {
        fetchMeals(searchText);
    }
});

const fetchMeals = async (query) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        displayResults(data.meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
};

const displayResults = (meals) => {
    const resultsDiv = document.getElementById('results');
    const showAllButton = document.getElementById('showAllButton');
    resultsDiv.innerHTML = '';
    showAllButton.style.display = 'none';

    if (meals && meals.length > 0) 
        const totalMeals = meals.length;
        const mealsToShow = totalMeals > 5 ? meals.slice(0, 5) : meals;
        mealsToShow.forEach(createMealCard);

        if (totalMeals > 5) {
            showAllButton.style.display = 'block';
            showAllButton.onclick = () => showAllMeals(meals);
        }
    } else {
        resultsDiv.innerHTML = '<p class="text-center">No meals found. Try a different search.</p>';
    }
};
