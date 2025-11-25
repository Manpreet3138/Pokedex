const API_BASE = "http://localhost:8080/api/pokemon";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultArea = document.getElementById("resultArea");
const errorArea = document.getElementById("errorArea");

const nameEl = document.getElementById("pokemonName");
const idEl = document.getElementById("pokemonId");
const typesEl = document.getElementById("pokemonTypes");
const spriteEl = document.getElementById("pokemonSprite");
const tagsEl = document.getElementById("pokemonTags");
const heightEl = document.getElementById("pokemonHeight");
const weightEl = document.getElementById("pokemonWeight");
const baseExpEl = document.getElementById("pokemonBaseExp");
const abilitiesEl = document.getElementById("pokemonAbilities");
const statsEl = document.getElementById("pokemonStats");

searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        doSearch();
    }
});

function doSearch() {
    const value = searchInput.value.trim();
    if (!value) {
        showError("Please enter a Pokémon name or ID.");
        return;
    }

    clearError();
    setLoading(true);

    fetch(`${API_BASE}/${encodeURIComponent(value)}`)
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "Failed to fetch Pokémon.");
            }
            return res.json();
        })
        .then((data) => {
            renderPokemon(data);
        })
        .catch((err) => {
            console.error(err);
            showError("Pokémon not found. Try another name or ID.");
        })
        .finally(() => {
            setLoading(false);
        });
}

function renderPokemon(data) {
    nameEl.textContent = data.name;
    idEl.textContent = `#${String(data.id).padStart(3, "0")}`;

    typesEl.innerHTML = "";
    (data.types || []).forEach((t) => {
        const span = document.createElement("span");
        span.className = "type-pill";
        span.textContent = t.type.name;
        typesEl.appendChild(span);
    });

    const sprite =
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.front_default ||
        "";
    spriteEl.src = sprite;
    spriteEl.alt = data.name;

    tagsEl.innerHTML = "";
    const totalStats = (data.stats || []).reduce(
        (sum, stat) => sum + (stat.base_stat || 0),
        0
    );
    addTag(tagsEl, `${totalStats} total base stats`);

    if (totalStats >= 600) {
        addTag(tagsEl, "Pseudo-legendary vibes");
    }
    if ((data.types || []).some((t) => t.type.name === "dragon")) {
        addTag(tagsEl, "Dragon type");
    }
    if ((data.abilities || []).some((a) => a.is_hidden)) {
        addTag(tagsEl, "Has hidden ability");
    }

    const heightMeters = data.height / 10;
    const weightKg = data.weight / 10;
    heightEl.textContent = `${heightMeters.toFixed(1)} m`;
    weightEl.textContent = `${weightKg.toFixed(1)} kg`;
    baseExpEl.textContent = data.base_experience ?? "-";

    abilitiesEl.innerHTML = "";
    (data.abilities || []).forEach((a) => {
        const li = document.createElement("li");
        li.textContent = a.ability.name + (a.is_hidden ? " (hidden)" : "");
        abilitiesEl.appendChild(li);
    });

    statsEl.innerHTML = "";
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

        statsEl.appendChild(row);
    });

    resultArea.classList.remove("hidden");
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
    resultArea.classList.add("hidden");
}

function clearError() {
    errorArea.textContent = "";
    errorArea.classList.add("hidden");
}

function setLoading(isLoading) {
    searchBtn.disabled = isLoading;
    searchBtn.textContent = isLoading ? "Searching..." : "Search";
}
