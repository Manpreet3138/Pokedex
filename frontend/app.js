const API_BASE = "https://pokedex-chhj.onrender.com";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultArea = document.getElementById("resultArea");
const errorArea = document.getElementById("errorArea");
const suggestionsDropdown = document.getElementById("suggestionsDropdown");

let suggestionsTimeout;

searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        doSearch();
        suggestionsDropdown.classList.add("hidden");
    }
});

searchInput.addEventListener("input", (e) => {
    clearTimeout(suggestionsTimeout);
    const value = e.target.value.trim();
    
    if (!value) {
        suggestionsDropdown.classList.add("hidden");
        return;
    }
    
    suggestionsTimeout = setTimeout(() => {
        showSuggestions(value);
    }, 200);
});

document.addEventListener("click", (e) => {
    if (e.target !== searchInput && !suggestionsDropdown.contains(e.target)) {
        suggestionsDropdown.classList.add("hidden");
    }
});

function doSearch() {
    const value = searchInput.value.trim();
    if (!value) {
        showError("Please enter a Pokémon name or ID.");
        return;
    }

    clearError();
    resultArea.innerHTML = "";
    resultArea.classList.add("hidden");
    setLoading(true);

    const pokemonNames = value.split(',').map(name => name.trim()).filter(name => name);
    
    if (pokemonNames.length === 0) {
        showError("Please enter a Pokémon name or ID.");
        setLoading(false);
        return;
    }

    const fetchPromises = pokemonNames.map(name => 
        fetch(`${API_BASE}/${encodeURIComponent(name)}`)
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`${name} not found`);
                }
                return res.json();
            })
            .then(data => ({ success: true, data, name }))
            .catch(err => ({ success: false, error: err.message, name }))
    );

    Promise.all(fetchPromises)
        .then(results => {
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            if (successful.length > 0) {
                resultArea.classList.remove("hidden");
                successful.forEach(result => {
                    renderPokemonCard(result.data);
                });
            }

            if (failed.length > 0) {
                const failedNames = failed.map(f => f.name).join(', ');
                showError(`Could not find: ${failedNames}`);
            }

            if (successful.length === 0) {
                showError("No Pokémon found. Please check your input.");
            }
        })
        .finally(() => {
            setLoading(false);
        });
}

function renderPokemonCard(data) {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    const header = document.createElement("div");
    header.className = "result-header";

    const nameId = document.createElement("div");
    nameId.className = "name-id";

    const name = document.createElement("h2");
    name.textContent = data.name;

    const id = document.createElement("span");
    id.className = "pill";
    id.textContent = `#${String(data.id).padStart(3, "0")}`;

    nameId.appendChild(name);
    nameId.appendChild(id);

    const typesContainer = document.createElement("div");
    typesContainer.className = "types";
    (data.types || []).forEach((t) => {
        const span = document.createElement("span");
        span.className = "type-pill";
        span.textContent = t.type.name;
        typesContainer.appendChild(span);
    });

    header.appendChild(nameId);
    header.appendChild(typesContainer);

    const content = document.createElement("div");
    content.className = "result-content";

    const spritePanel = document.createElement("div");
    spritePanel.className = "sprite-panel";

    const sprite = document.createElement("img");
    sprite.src = data.sprites?.other?.["official-artwork"]?.front_default ||
                 data.sprites?.front_default || "";
    sprite.alt = data.name;

    const tags = document.createElement("div");
    tags.className = "tags";

    const totalStats = (data.stats || []).reduce(
        (sum, stat) => sum + (stat.base_stat || 0),
        0
    );
    addTag(tags, `${totalStats} total base stats`);

    if (totalStats >= 600) {
        addTag(tags, "Pseudo-legendary vibes");
    }
    if ((data.types || []).some((t) => t.type.name === "dragon")) {
        addTag(tags, "Dragon type");
    }
    if ((data.abilities || []).some((a) => a.is_hidden)) {
        addTag(tags, "Has hidden ability");
    }

    spritePanel.appendChild(sprite);
    
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "download-btn";
    downloadBtn.textContent = "Download Image";
    downloadBtn.addEventListener("click", () => downloadPokemonImage(data.name, sprite.src));
    spritePanel.appendChild(downloadBtn);
    
    spritePanel.appendChild(tags);

    const metaPanel = document.createElement("div");
    metaPanel.className = "meta-panel";

    const heightMeters = data.height / 10;
    const weightKg = data.weight / 10;

    const heightRow = createMetaRow("Height", `${heightMeters.toFixed(1)} m`);
    const weightRow = createMetaRow("Weight", `${weightKg.toFixed(1)} kg`);
    const baseExpRow = createMetaRow("Base Experience", data.base_experience ?? "-");

    metaPanel.appendChild(heightRow);
    metaPanel.appendChild(weightRow);
    metaPanel.appendChild(baseExpRow);

    const abilitiesBlock = document.createElement("div");
    abilitiesBlock.className = "meta-block";
    const abilitiesTitle = document.createElement("h3");
    abilitiesTitle.textContent = "Abilities";
    const abilitiesList = document.createElement("ul");
    (data.abilities || []).forEach((a) => {
        const li = document.createElement("li");
        li.textContent = a.ability.name + (a.is_hidden ? " (hidden)" : "");
        abilitiesList.appendChild(li);
    });
    abilitiesBlock.appendChild(abilitiesTitle);
    abilitiesBlock.appendChild(abilitiesList);

    const statsBlock = document.createElement("div");
    statsBlock.className = "meta-block";
    const statsTitle = document.createElement("h3");
    statsTitle.textContent = "Base Stats";
    const statsList = document.createElement("div");
    statsList.className = "stats-list";
    (data.stats || []).forEach((s) => {
        const row = document.createElement("div");
        row.className = "stat-row";

        const nameSpan = document.createElement("span");
        nameSpan.className = "stat-name";
        nameSpan.textContent = s.stat.name.replace("special-", "sp ");

        const barWrapper = document.createElement("div");
        barWrapper.className = "stat-bar-wrapper";

        const bar = document.createElement("div");
        bar.className = "stat-bar";
        const val = s.base_stat || 0;
        const width = Math.min((val / 180) * 100, 100);
        bar.style.width = `${width}%`;

        barWrapper.appendChild(bar);

        const valueSpan = document.createElement("span");
        valueSpan.className = "stat-value";
        valueSpan.textContent = val;

        row.appendChild(nameSpan);
        row.appendChild(barWrapper);
        row.appendChild(valueSpan);

        statsList.appendChild(row);
    });
    statsBlock.appendChild(statsTitle);
    statsBlock.appendChild(statsList);

    metaPanel.appendChild(abilitiesBlock);
    metaPanel.appendChild(statsBlock);

    content.appendChild(spritePanel);
    content.appendChild(metaPanel);

    card.appendChild(header);
    card.appendChild(content);

    resultArea.appendChild(card);
}

function createMetaRow(label, value) {
    const row = document.createElement("div");
    row.className = "meta-row";

    const labelSpan = document.createElement("span");
    labelSpan.className = "meta-label";
    labelSpan.textContent = label;

    const valueSpan = document.createElement("span");
    valueSpan.className = "meta-value";
    valueSpan.textContent = value;

    row.appendChild(labelSpan);
    row.appendChild(valueSpan);

    return row;
}

function addTag(container, text) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = text;
    container.appendChild(span);
}

function showError(message) {
    errorArea.textContent = message;
    errorArea.classList.remove("hidden");
}

function clearError() {
    errorArea.textContent = "";
    errorArea.classList.add("hidden");
}

function setLoading(isLoading) {
    searchBtn.disabled = isLoading;
    searchBtn.textContent = isLoading ? "Searching..." : "Search";
}

function downloadPokemonImage(pokemonName, imageUrl) {
    if (!imageUrl) {
        alert("Image not available for download");
        return;
    }
    
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${pokemonName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(err => {
            console.error("Download failed:", err);
            alert("Failed to download image");
        });
}

function showSuggestions(keyword) {
    fetch(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(suggestions => {
            if (suggestions.length === 0) {
                suggestionsDropdown.classList.add("hidden");
                return;
            }
            
            suggestionsDropdown.innerHTML = "";
            suggestions.forEach(name => {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.textContent = name;
                item.addEventListener("click", () => {
                    searchInput.value = name;
                    suggestionsDropdown.classList.add("hidden");
                    doSearch();
                });
                suggestionsDropdown.appendChild(item);
            });
            
            suggestionsDropdown.classList.remove("hidden");
        })
        .catch(err => {
            console.error("Suggestions failed:", err);
            suggestionsDropdown.classList.add("hidden");
        });
}
