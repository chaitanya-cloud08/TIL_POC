document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const formatOptions = document.querySelectorAll('.format-option');
    const cardBodyContent = document.querySelector('.card-body-content');
    const reopenModalTrigger = document.getElementById('reopen-modal-trigger');

    // --- Data for different formats ---
    const newsContent = {
        bullets: `
            <ul>
                <li>Zelensky accused Europe of funding Russia by buying its oil.</li>
                <li>He named Germany and Hungary for blocking oil embargoes.</li>
                <li>Russia could earn £250bn ($326bn) this year from energy sales.</li>
            </ul>
        `,
        genz: `
            <p class="genz">So, like, Zelensky went on BBC and was NOT having it. He basically said Europe is sending "blood money" to Russia by still buying their oil. He straight up called out Germany and Hungary for blocking a full-on oil ban. The tea is Russia's about to make a wild £250bn this year from energy. It's giving... complicated. No cap.</p>
        `,
        summary: `
            <p>In an interview with the BBC, Ukrainian President Volodymyr Zelensky stated that European nations continuing to purchase Russian oil are paying with "blood money." He specifically identified Germany and Hungary as countries hindering a complete oil embargo. Projections indicate Russia may earn as much as £250 billion ($326 billion) from its energy exports this year.</p>
        `,
        language: `
            <p>Language selection is not implemented in this demo, but this is where it would go!</p>
        `
    };

    let currentFormat = 'bullets';

    // --- Functions ---

    /**
     * Updates the news card content based on the selected format.
     * @param {string} format - The selected format ('bullets', 'genz', 'summary').
     */
    function updateNewsContent(format) {
        if (newsContent[format]) {
            cardBodyContent.innerHTML = newsContent[format];
            currentFormat = format;
        }
    }

    /**
     * Updates the visual selection state in the modal.
     */
    function updateSelectedOption() {
        formatOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.format === currentFormat) {
                opt.classList.add('selected');
            }
        });
    }

    /**
     * Shows the modal with a slide-up animation.
     */
    function showModal() {
        updateSelectedOption(); // Ensure correct option is highlighted when reopened
        modalOverlay.classList.add('visible');
    }

    /**
     * Hides the modal with a slide-down animation.
     */
    function hideModal() {
        modalOverlay.classList.remove('visible');
    }

    // --- Event Listeners ---

    // Handle clicks on format options
    formatOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedFormat = option.dataset.format;
            
            // Update the content
            updateNewsContent(selectedFormat);
            
            // Update the visual selection
            currentFormat = selectedFormat;
            updateSelectedOption();
            
            // Hide the modal after a short delay to show selection
            setTimeout(hideModal, 200);
        });
    });

    // Close modal with the 'X' button
    closeModalBtn.addEventListener('click', hideModal);

    // Re-open modal using the card's menu icon
    reopenModalTrigger.addEventListener('click', showModal);


    // --- Initial State ---

    // Set the initial content to '3 Bullets'
    updateNewsContent('bullets');
    // Show the modal on page load
    setTimeout(showModal, 500); // Small delay for effect
});