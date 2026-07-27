// Adds interactive search and keyboard controls to the Skills Guide page.
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("skill-search-input");
    const clearButton = document.getElementById("clear-skill-search");
    const statusText = document.getElementById("skill-search-status");
    const noResultsMessage = document.getElementById("skill-no-results");

    const skillSections = Array.from(
        document.querySelectorAll(".skills-content .skill-section")
    );

    const skillLinks = Array.from(
        document.querySelectorAll(".skills-nav a")
    );

    // Stop safely if the Skills Guide search elements are not available.
    if (
        !searchInput ||
        !clearButton ||
        !statusText ||
        !noResultsMessage ||
        skillSections.length === 0
    ) {
        return;
    }

    function filterSkills(searchTerm) {
        const query = searchTerm.trim().toLowerCase();
        let visibleCount = 0;

        skillSections.forEach((section) => {
            const sectionText = section.textContent.toLowerCase();
            const matchesSearch = sectionText.includes(query);

            section.hidden = !matchesSearch;

            if (matchesSearch) {
                visibleCount++;
            }
        });

        // Hide sidebar links when their matching skill section is hidden.
        skillLinks.forEach((link) => {
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            const listItem = link.closest("li");

            if (targetSection && listItem) {
                listItem.hidden = targetSection.hidden;
            }
        });

        noResultsMessage.hidden = visibleCount !== 0;

        if (query === "") {
            statusText.textContent =
                `Showing all ${skillSections.length} skills.`;
        } else {
            statusText.textContent =
                `Showing ${visibleCount} of ${skillSections.length} skills for "${searchTerm.trim()}".`;
        }
    }

    // Filter immediately whenever the user types.
    searchInput.addEventListener("input", (event) => {
        filterSkills(event.target.value);
    });

    // Clear the search when the Clear button is clicked.
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        filterSkills("");
        searchInput.focus();
    });

    // Let the user press Escape to reset the search.
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            searchInput.value = "";
            filterSkills("");
            searchInput.focus();
        }
    });

    filterSkills("");
});
