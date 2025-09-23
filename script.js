// Product Image Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-img');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Touch/Swipe Support for Mobile
let startX = 0;
let endX = 0;
const sliderContainer = document.querySelector('.slider-container');

if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide(); // Swipe left to next
            } else {
                prevSlide(); // Swipe right to previous
            }
        }
    });
}

// Static Hair Care Plans (replaces AI API)
const hairPlans = {
    "Oily (Teliya)": {
        "Hair Fall (Baalon ka girna)": `Aapka Weekly Plan:
- Monday: Usmania Oil lagayein aur 30 min massage karein.
- Tuesday: Shampoo se dho lein aur conditioner use karein.
- Wednesday: Rest day, oil hi rakhein.
- Thursday: Light massage with oil.
- Friday: Shampoo aur mask lagayein.
- Saturday: Full treatment with oil.
- Sunday: Rest aur check progress.

Usmania Oil ka istemal: Har do din mein 2-3 ml oil scalp par lagayein, 1 ghanta rakh kar dho lein. Yeh oil baalon ki roots ko strong banata hai aur girna kam karta hai.

Khan-paan Tip: Amla aur neem ke juice peejein daily for vitamin C.

Lifestyle Tip: Stress kam karein, yoga karein for better blood flow.`,

        "Dandruff (Rusi)": `Aapka Weekly Plan:
- Monday: Oil massage with Usmania Oil.
- Tuesday: Anti-dandruff shampoo use karein.
- Wednesday: Oil lagayein aur rest.
- Thursday: Massage aur rinse.
- Friday: Shampoo with conditioner.
- Saturday: Full oil treatment.
- Sunday: Monitor aur rest.

Usmania Oil ka istemal: Daily 1-2 ml oil scalp par lagayein, rusi ko khatam karne ke liye.

Khan-paan Tip: Yogurt aur lemon ka mix khayein.

Lifestyle Tip: Hair daily brush karein aur clean rakhein.`,

        "Slow Growth (Dheemi growth)": `Aapka Weekly Plan:
- Monday: Oil application.
- Tuesday: Shampoo.
- Wednesday: Oil rest.
- Thursday: Massage.
- Friday: Treatment.
- Saturday: Full care.
- Sunday: Check growth.

Usmania Oil ka istemal: Weekly 3 baar lagayein for growth boost.

Khan-paan Tip: Nuts aur fruits khayein.

Lifestyle Tip: 8 hours sleep lein.`,

        "Dullness (Bejaan baal)": `Aapka Weekly Plan:
- Monday: Oil shine.
- Tuesday: Wash.
- Wednesday: Oil.
- Thursday: Massage.
- Friday: Condition.
- Saturday: Treatment.
- Sunday: Rest.

Usmania Oil ka istemal: 2-3 baar week mein for shine.

Khan-paan Tip: Healthy diet with proteins.

Lifestyle Tip: Avoid heat styling.`
    },
    "Dry (Rukhe)": {
        "Hair Fall (Baalon ka girna)": `Aapka Weekly Plan:
- Monday: Deep oil massage.
- Tuesday: Gentle shampoo.
- Wednesday: Oil rest.
- Thursday: Moisturize.
- Friday: Conditioner.
- Saturday: Treatment.
- Sunday: Rest.

Usmania Oil ka istemal: Daily light application to prevent dryness and fall.

Khan-paan Tip: Coconut water peejein.

Lifestyle Tip: Humidifier use karein.`,

        "Dandruff (Rusi)": `Aapka Weekly Plan:
- Monday: Oil.
- Tuesday: Shampoo.
- Wednesday: Rest.
- Thursday: Oil.
- Friday: Wash.
- Saturday: Treatment.
- Sunday: Monitor.

Usmania Oil ka istemal: Balanced for dry scalp.

Khan-paan Tip: Hydrating foods.

Lifestyle Tip: Avoid harsh shampoos.`,

        "Slow Growth (Dheemi growth)": `Aapka Weekly Plan:
- Monday: Oil.
- Tuesday: Wash.
- Wednesday: Oil.
- Thursday: Massage.
- Friday: Condition.
- Saturday: Treatment.
- Sunday: Rest.

Usmania Oil ka istemal: Nourish roots.

Khan-paan Tip: Biotin-rich foods.

Lifestyle Tip: Scalp massages.`,

        "Dullness (Bejaan baal)": `Aapka Weekly Plan:
- Monday: Oil.
- Tuesday: Wash.
- Wednesday: Oil.
- Thursday: Condition.
- Friday: Treatment.
- Saturday: Full care.
- Sunday: Rest.

Usmania Oil ka istemal: Restore moisture.

Khan-paan Tip: Omega-3 foods.

Lifestyle Tip: Natural drying.`
    },
    "Normal (Samanya)": {
        "Hair Fall (Baalon ka girna)": `Aapka Weekly Plan:
- Monday: Oil.
- Tuesday: Wash.
- Wednesday: Rest.
- Thursday: Oil.
- Friday: Condition.
- Saturday: Treatment.
- Sunday: Rest.

Usmania Oil ka istemal: Strengthen with regular use.

Khan-paan Tip: Balanced diet.

Lifestyle Tip: Stress management.`,

        "Dandruff (Rusi)": `Aapka Weekly Plan:
- Monday: Oil.
- Tuesday: Shampoo.
- Wednesday: Rest.
- Thursday: Oil.
- Friday: Wash.
- Saturday: Treatment.
- Sunday: Rest.

Usmania Oil ka istemal: Prevent dandruff.

Khan-paan Tip: Probiotics.

Lifestyle Tip: Clean habits.`,

        "Slow Growth (Dheemi growth)": `Aapka Weekly Plan:
- Monday: Oil.
- Tuesday: Wash.
- Wednesday: Oil.
- Thursday: Massage.
- Friday: Condition.
- Saturday: Treatment.
- Sunday: Rest.

Usmania Oil ka istemal: Boost growth.

Khan-paan Tip: Protein intake.

Lifestyle Tip: Exercise.`,

        "Dullness (Bejaan baal)": `Aapka Weekly Plan:
- Monday: Oil.
- Tuesday: Wash.
- Wednesday: Oil.
- Thursday: Condition.
- Friday: Treatment.
- Saturday: Care.
- Sunday: Rest.

Usmania Oil ka istemal: Shine restore.

Khan-paan Tip: Vitamins.

Lifestyle Tip: Healthy routine.`
    }
};

function generatePlan() {
    const hairType = document.getElementById('hair-type').value;
    const hairConcern = document.getElementById('hair-concern').value;

    // Show loader and hide previous response
    loader.classList.remove('hidden');
    geminiResponseDiv.classList.add('hidden');
    geminiResponseDiv.textContent = '';
    generatePlanBtn.disabled = true;
    generatePlanBtn.textContent = 'Aapka plan taiyar ho raha hai...';

    // Get plan immediately
    const plan = hairPlans[hairType]?.[hairConcern];
    if (plan) {
        geminiResponseDiv.textContent = plan;
    } else {
        geminiResponseDiv.textContent = 'Maaf kijiye, aapke liye plan nahi mila. Kripya contact karein.';
    }

    // Hide loader and show response
    loader.classList.add('hidden');
    geminiResponseDiv.classList.remove('hidden');
    generatePlanBtn.disabled = false;
    generatePlanBtn.innerHTML = '✨ Mera Plan Banayein';
}
