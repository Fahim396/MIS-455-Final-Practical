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
    const showAllButton = docum