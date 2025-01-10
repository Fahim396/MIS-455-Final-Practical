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

    if (meals && meals.length > 0) {
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

const createMealCard = (meal) => {
    const resultsDiv = document.getElementById('results');
    const mealCard = document.createElement('div');
    mealCard.className = 'col-md-4';
    mealCard.innerHTML = `
        <div class="card">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
             <h5 class="card-title">${meal.strMeal}</h5>
                <p class="card-text"><strong>Meal ID:</strong> ${meal.idMeal}</p>
                <p class="card-text"><strong>Category:</strong> ${meal.strCategory}</p>
                <p class="card-text"><strong>Area:</strong> ${meal.strArea}</p>
                <p class="card-text"><strong>Cooking Instructions:</strong> ${meal.strInstructions.substring(0, 100)}...</p>
                <span class="read-more" onclick="showMealDetails('${meal.idMeal}')">See More</span>
            </div>
        </div>
    `;
    resultsDiv.appendChild(mealCard);
};

const showAllMeals = (meals) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    meals.forEach(createMealCard);
    document.getElementById('showAllButton').style.display = 'none';
};

const showMealDetails = async (mealId) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];
        displayMealDetails(meal);
    } catch (error) {
        console.error('Error fetching meal details:', error);
    }
};

const displayMealDetails = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }

    const instructions = meal.strInstructions.split('\n').filter(step => step.trim() !== '');
    const detailsHtml = `
    <div class="modal fade" id="mealDetailsModal" tabindex="-1" aria-labelledby="mealDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mealDetailsModalLabel">${meal.strMeal}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   <img src="${meal.strMealThumb}" class="img-fluid w-100 mb-2" alt="${meal.strMeal}">
                    <div class="px-2">
                        <p><strong>Cooking Instructions:</strong></p>
                        <ol class="ps-3">
                            ${instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
`;

document.body.insertAdjacentHTML('beforeend', detailsHtml);
const modal = new bootstrap.Modal(document.getElementById('mealDetailsModal'));
modal.show();

document.getElementById('mealDetailsModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
});
};
