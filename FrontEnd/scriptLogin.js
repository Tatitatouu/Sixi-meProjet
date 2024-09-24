document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.form-login');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Échec de la connexion');
            }

            const data = await response.json();

            localStorage.setItem('token', data.token); 
            window.location.href = 'modale.html'; 
            
        } catch (error) {
            alert('Erreur de connexion. Veuillez vérifier vos informations.');
        }
    });
});