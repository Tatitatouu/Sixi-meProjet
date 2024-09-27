let allWorks = [];

async function fetchData() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        allWorks = await response.json(); 
        
        displayWorks(allWorks); 
        fetchCategories();
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
    }
}
  
function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    
    gallery.innerHTML = '';
  
    works.forEach(work => {
        const workElement = document.createElement('div');
        workElement.classList.add('work-item');
        
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}" />
            <h3>${work.title}</h3>
        `;
        
        gallery.appendChild(workElement);
    });
}

async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
  
        const categories = await response.json(); 
        displayCategories(categories); 
        
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
    }
}
  
function displayCategories(categories) {
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = '';
  
    const allCategoryElement = document.createElement('div');
    allCategoryElement.classList.add('category-item');
    allCategoryElement.innerHTML = `<h4>Tous</h4>`;
    allCategoryElement.addEventListener('click', () => {
        displayWorks(allWorks);
    })
    categoriesContainer.appendChild(allCategoryElement);
  
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');
        categoryElement.innerHTML = `<h4>${category.name}</h4>`;
        categoriesContainer.appendChild(categoryElement);

        categoryElement.addEventListener(`click`, () => {
            const filtrerWorks = allWorks.filter (work => work.categoryId === category.id);
            displayWorks(filtrerWorks);
        });
        categoriesContainer.appendChild(categoryElement);
    });
}

fetchData();
fetchCategories();
