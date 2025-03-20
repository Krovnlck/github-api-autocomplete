document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocompleteList');
    const repoList = document.getElementById('repoList');

    let timeoutId;

    searchInput.addEventListener('input', function (e) {
        clearTimeout(timeoutId);
        const query = e.target.value.trim();
        if (!query) {
            autocompleteList.style.display = 'none';
            return;
        }
        timeoutId = setTimeout(() => fetchRepositories(query), 300);
    });

    function fetchRepositories(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
            .then(response => response.json())
            .then(data => {
                autocompleteList.innerHTML = '';
                if (data.items && data.items.length > 0) {
                    data.items.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item.full_name;
                        li.addEventListener('click', () => addRepository(item));
                        autocompleteList.appendChild(li);
                    });
                    autocompleteList.style.display = 'block';
                } else {
                    autocompleteList.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching repositories:', error));
    }

    function addRepository(repo) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${repo.full_name} - ${repo.owner.login} - Stars: ${repo.stargazers_count}
            <button onclick="removeRepository(this)">Remove</button>
        `;
        repoList.appendChild(li);
        searchInput.value = '';
        autocompleteList.style.display = 'none';
    }

    window.removeRepository = function (button) {
        button.parentElement.remove();
    };
});
