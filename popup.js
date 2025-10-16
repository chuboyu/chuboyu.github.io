const banner = document.getElementById('scroll-hint-banner');
const sectionIds = ['thesis-section', 'contact-section', 'past-section'];

if (banner) {
    banner.addEventListener('click', () => {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        let nextSection = null;
        let smallestDistance = Infinity;

        sectionIds.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                // Get the position of the top of the section relative to the document
                const sectionTop = section.getBoundingClientRect().top + currentScroll;
                
                // The distance is the gap between the current scroll position and the section's top
                const distance = sectionTop - currentScroll;

                // We look for the section that is BELOW the current viewport (distance > 5)
                // AND is the smallest positive distance found so far.
                if (distance > 5 && distance < smallestDistance) {
                    smallestDistance = distance;
                    nextSection = section;
                }
            }
        });

        // If a valid next section is found, scroll to it
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Scroll to the top edge of the section
            });
        } else {
            // If no section is found below, scroll to the bottom of the page
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
}

function checkScrollPosition() {
    const banner = document.getElementById('scroll-hint-banner');
    if (!banner) return;
    
    // Get current scroll metrics
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
    const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    
    // 1. Determine if scrolling is even possible.
    // Use a small tolerance (e.g., 20px) to account for fixed banners and rounding issues.
    const isScrollable = scrollHeight > (clientHeight + 20); 

    // 2. Check if the user is at the bottom (within a 1px tolerance)
    const isAtBottom = (scrollTop + clientHeight) >= scrollHeight - 1;

    // 3. Logic to hide/show the banner
    if (isScrollable && isAtBottom) {
        // Condition: Hide the banner ONLY if the page is scrollable AND the user has reached the bottom.
        banner.classList.add('hidden');
    } else if (isScrollable) {
        // Condition: Show the banner ONLY if the page is scrollable and the user is NOT at the bottom.
        banner.classList.remove('hidden');
    } else {
        // Condition: Page is NOT scrollable (content fits). Keep the banner hidden, 
        // as a scroll hint is unnecessary.
        banner.classList.add('hidden');
    }
}
// ... rest of popup.js remains the same ...

document.addEventListener('DOMContentLoaded', () => {


    checkScrollPosition(); // Check position on load
    window.addEventListener('scroll', checkScrollPosition); // Check position on scroll
    window.addEventListener('resize', checkScrollPosition); // Re-check on resize

    const triggers = document.querySelectorAll('.pop-up-trigger');
    const cardContainer = document.getElementById('pop-up-container');
    let activeCard = null; // Track the currently active card
    const viewportMargin = 15; // Minimum distance from the viewport edges (in pixels)

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();

            const cardId = trigger.getAttribute('data-card') + '-card';
            const newCard = document.getElementById(cardId);
            
            // If a card is already active, close it
            if (activeCard && activeCard !== newCard) {
                activeCard.classList.remove('active');
            }

            // If the clicked card is already active, close it (toggle)
            if (newCard === activeCard) {
                newCard.classList.remove('active');
                activeCard = null;
                return;
            }
            
            // --- Show the new card ---
            
            // 1. Calculate trigger position and viewport dimensions
            const rect = trigger.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Temporarily make the card visible and position it to measure its size
            newCard.style.opacity = '0';
            newCard.style.pointerEvents = 'none';
            newCard.style.position = 'fixed'; // Use fixed for accurate measurement against the viewport
            newCard.style.left = '0';
            newCard.style.top = '0';
            newCard.classList.add('active'); // Must be active to get correct width/height
            
            const cardWidth = newCard.offsetWidth;
            const cardHeight = newCard.offsetHeight;
            
            // 2. Determine initial preferred position (below and to the left of the trigger)
            let finalTop = rect.bottom + 5;
            let finalLeft = rect.left;

            // 3. Horizontal (Left/Right) Adjustment
            
            // If the card goes off the right edge, shift it left
            if (finalLeft + cardWidth + viewportMargin > windowWidth) {
                finalLeft = windowWidth - cardWidth - viewportMargin;
            }

            // If the card goes off the left edge (or after shifting right), pin it to the left
            if (finalLeft < viewportMargin) {
                finalLeft = viewportMargin;
            }

            // 4. Vertical (Top/Bottom) Adjustment
            
            // If the card goes off the bottom edge
            if (finalTop + cardHeight + viewportMargin > windowHeight) {
                // Try to place it ABOVE the trigger instead
                finalTop = rect.top - cardHeight - 5; 
            }
            
            // If the card goes off the top edge (even after shifting above)
            if (finalTop < viewportMargin) {
                // Pin it to the top of the viewport
                finalTop = viewportMargin;
            }
            
            // 5. Apply Final Position and State
            newCard.style.position = 'fixed'; // Keep using fixed for positioning relative to the viewport
            newCard.style.top = `${finalTop}px`;
            newCard.style.left = `${finalLeft}px`;
            
            newCard.style.opacity = '1';
            newCard.style.pointerEvents = 'auto';
            
            activeCard = newCard;
        });
    });

    // MODIFIED: Close the card only when clicking outside the active card or its trigger
    document.addEventListener('click', (event) => {
        if (activeCard) {
            // Check if the click target is inside the active card
            const isClickInsideCard = activeCard.contains(event.target);
            
            // Check if the click target is the trigger that opened this card (or any trigger)
            // Use closest() to check if the clicked element or any parent is a trigger
            const isClickOnTrigger = event.target.closest('.pop-up-trigger');
            
            // If the click is not inside the card AND not on any trigger, close the card
            if (!isClickInsideCard && !isClickOnTrigger) {
                activeCard.classList.remove('active');
                activeCard = null;
            }
        }
    });
});