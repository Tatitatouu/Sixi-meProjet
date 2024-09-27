let allWorks = [];
let allCategories = [];

async function fetchData() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        allWorks = await response.json(); 
        console.log(allWorks);
        
        displayWorks(allWorks);
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


fetchData();

document.addEventListener('DOMContentLoaded', function() {
    const openModaleBtn = document.getElementById('openModale');
    const closeModaleBtn = document.getElementById('closeModale');
    const modale = document.getElementById('modale');
    const galleryContainer = document.querySelector('.gallery-container');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const galleryView = document.getElementById('galleryView');
    const backBtn = document.getElementById('backBtn');
    const addPhotoView = document.getElementById('addPhotoView');
    const imgInput = document.getElementById('photo-upload');
    const btnSubmit = document.getElementById('btn-submit');
    const btnEdition = document.getElementById('editionBanner');

    openModaleBtn.addEventListener('click', function() {
        modale.classList.add('active');
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        displayWorksInModale();
    });

    btnEdition.addEventListener('click', function(){
        modale.classList.add('active');
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        displayWorksInModale();
    });

    closeModaleBtn.addEventListener('click', function() {
        modale.classList.remove('active');
        const imgPreview = document.getElementById('preview-image');
        imgPreview.src = '';
        imgPreview.style.display = 'none'; 
        imgPreview.style.display = 'none';
        document.querySelector('.upload-label').style.display = 'block';
        clearCategories();
    });

    addPhotoBtn.addEventListener('click', async function() {
        galleryView.style.display = 'none';
        addPhotoView.style.display = 'block';
        allCategories = await fetchCategories();
        console.log(allCategories);
        
        addCategories(allCategories);
    });


    backBtn.addEventListener('click', function() {
        addPhotoView.style.display = 'none'; 
        galleryView.style.display = 'block'; 
    });

    imgInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const previewContainer = document.getElementById('preview-container');
        const previewImage = document.getElementById('preview-image');

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                previewImage.src = e.target.result; 
                previewImage.style.display = 'block'; 
                previewContainer.style.display = 'block'; 
                
                imgInput.style.display = 'none';
                document.querySelector('.upload-label').style.display = 'none';
            }

            reader.readAsDataURL(file);
        }
    });

    btnSubmit.addEventListener('click', async function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const selectedCategoryName = document.getElementById('category').value;

        if (!title || ! selectedCategoryName) {
            alert('Veuillez remplir tous les champs avant de soumettre');
            return;
        }

        try {
            const imageFile = document.getElementById('photo-upload').files[0];
            const title = document.getElementById('title').value;
            const selectedCategoryName = document.getElementById('category').value;
            const categoryId = allCategories.find(category => category.name === selectedCategoryName).id;

            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('title', title);
            formData.append('category', categoryId);

            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                console.error('Erreur lors de l\'ajout du travail');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données: ', error);
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modale) {
            modale.classList.remove('active');
            clearCategories();
            const imgPreview = document.getElementById('preview-image');
            imgPreview.src = '';
            imgPreview.style.display = 'none'; 
            imgPreview.style.display = 'none';
            document.querySelector('.upload-label').style.display = 'block';
        }
    });
    
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
      
            categories = await response.json(); 
            return categories;            
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
        }
    }

    function addCategories(categories) {
        const categorieSelect = document.getElementById('category');

        categories.forEach(categorie => {
            const categorieOption = document.createElement('option');
            categorieOption.innerHTML = categorie.name;
            categorieSelect.appendChild(categorieOption);
        });
    }

    function clearCategories() {
        const categorieSelect = document.getElementById('category');
        const firstOption = categorieSelect.options[0]; 
        categorieSelect.innerHTML = ''; 
        categorieSelect.appendChild(firstOption); 
    }

    function displayWorksInModale() {
        galleryContainer.innerHTML = '';
        allWorks.forEach(work => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('modale-img-container');

            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteWork(work.id));
            const imgDelete = document.createElement ('img');
            imgDelete.src = "./assets/icons/bin.png";
            deleteBtn.appendChild(imgDelete);

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteBtn);
            galleryContainer.appendChild(imgContainer);
        });
    }

    async function deleteWork(id) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                allWorks = allWorks.filter(work => work.id !== id);
                displayWorks(allWorks);
                displayWorksInModale();
            } else {
                console.error('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    }
});
