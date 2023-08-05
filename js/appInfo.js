      // Fonction pour récupérer le paramètre "name" dans l'URL
        function getParameterByName(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        // Fonction pour afficher les informations de l'application en fonction du nom donné dans l'URL
        function displayAppInfo(appData) {
            const appInfoDiv = document.getElementById("appInfo");

            if (appData) {
                const appIcon = document.createElement("img");
                appIcon.src = appData.icon;
                appIcon.alt = `${appData.name} Icon`;
                appIcon.width = 100;

                const appNameElement = document.createElement("h2");
                appNameElement.textContent = appData.name;

                const appDeveloper = document.createElement("p");
                appDeveloper.textContent = `Developer: ${appData.developer}`;

                const appVersion = document.createElement("p");
                appVersion.textContent = `Version: ${appData.version}`;

                const appCompatibility = document.createElement("p");
                appCompatibility.textContent = `Compatibility: ${appData.compatibility}`;

                const appDescription = document.createElement("p");
                appDescription.textContent = appData.description;

                appInfoDiv.appendChild(appIcon);
                appInfoDiv.appendChild(appNameElement);
                appInfoDiv.appendChild(appDeveloper);
                appInfoDiv.appendChild(appVersion);
                appInfoDiv.appendChild(appCompatibility);
                appInfoDiv.appendChild(appDescription);
            } else {
                appInfoDiv.textContent = "Application not found.";
            }
        }

        // Récupérer le nom de l'application depuis l'URL et afficher ses informations
        const appNameFromURL = getParameterByName("name");

        // Charger le fichier JSON en utilisant une requête AJAX
        const jsonFileURL = "apps.json";
        fetch(jsonFileURL)
            .then(response => response.json())
            .then(data => {
                const appData = data.Utilities.find(app => app.name === appNameFromURL || data.Jailbreak.find(jb => jb.name === appNameFromURL));
                displayAppInfo(appData);
            })
            .catch(error => {
                console.error("Error loading JSON file:", error);
                const appInfoDiv = document.getElementById("appInfo");
                appInfoDiv.textContent = "Error loading application data.";
            });