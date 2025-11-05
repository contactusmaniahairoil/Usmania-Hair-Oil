// Product Image Slider & Interactivity
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-img');
const sliderContainer = document.querySelector('.slider-container');
const sliderAutoplayDelay = 4500;
let sliderInterval;

// Hair plan elements
const generatePlanBtn = document.getElementById('generate-plan-btn');
const loader = document.getElementById('loader');
const geminiResponseDiv = document.getElementById('gemini-response');

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

function startSliderAutoplay() {
    if (slides.length <= 1 || sliderInterval) return;
    sliderInterval = setInterval(() => {
        nextSlide();
    }, sliderAutoplayDelay);
}

function stopSliderAutoplay() {
    if (!sliderInterval) return;
    clearInterval(sliderInterval);
    sliderInterval = null;
}

// Touch/Swipe Support for Mobile
let startX = 0;
let endX = 0;

if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopSliderAutoplay();
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
        startSliderAutoplay();
    });

    sliderContainer.addEventListener('mouseenter', stopSliderAutoplay);
    sliderContainer.addEventListener('mouseleave', startSliderAutoplay);
}

if (slides.length) {
    showSlide(currentSlide);
    // Delay autoplay slightly to avoid clashing with initial reveal
    setTimeout(startSliderAutoplay, 1200);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopSliderAutoplay();
    } else if (sliderContainer && sliderContainer.matches(':hover') === false) {
        startSliderAutoplay();
    }
});

// Scroll-triggered reveal animations
const revealElements = document.querySelectorAll('[data-reveal]');

if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });

    revealElements.forEach((el) => {
        const delay = el.getAttribute('data-reveal-delay');
        if (delay) {
            el.style.setProperty('--reveal-delay', `${delay}ms`);
        }
        revealObserver.observe(el);
    });
}

// Header shrink & navigation highlight on scroll
const header = document.getElementById('site-header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(document.querySelectorAll('section[id]'));
const headerScrollThreshold = 80;
let scrollTicking = false;

function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('header-scrolled', window.scrollY > headerScrollThreshold);
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140;
    let activeId = '';

    sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < bottom) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const targetId = link.getAttribute('href')?.replace('#', '') || '';
        link.classList.toggle('active', targetId === activeId);
    });
}

function onScroll() {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            updateHeaderState();
            updateActiveNavLink();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
updateHeaderState();
updateActiveNavLink();

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

function sendToWhatsApp(event) {
    if (event) {
        event.preventDefault();
    }

    const name = document.getElementById('name')?.value.trim();
    const mobile = document.getElementById('mobile')?.value.trim();
    const quantity = document.getElementById('quantity')?.value.trim();
    const city = document.getElementById('city')?.value.trim();
    const pin = document.getElementById('pin')?.value.trim();
    const post = document.getElementById('post')?.value.trim();
    const near = document.getElementById('near')?.value.trim();

    if (!name || !mobile || !quantity || !city || !pin || !post || !near) {
        alert('Kripya form ke saare details bhar dein.');
        return;
    }

    const phoneNumber = '919520007159';
    const messageLines = [
        'Namaste Usmania Hair Oil Team,',
        '',
        'Payment ka screenshot attached hai.',
        `Name: ${name}`,
        `Mobile: ${mobile}`,
        `Quantity: ${quantity}`,
        `Vill-/City: ${city}`,
        `Pin code: ${pin}`,
        `Post office: ${post}`,
        `NEAR by Add: ${near}`,
    ];

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;

    // Using location.href ensures Android opens WhatsApp app when available.
    window.location.href = whatsappUrl;
}

function shareUpiIntent() {
    const upiParams = new URLSearchParams({
        pa: '0952007159@ptyes',
        pn: 'Usmania Hair Oil',
        tn: 'Usmania Hair Oil Advance Payment',
        am: '99',
        cu: 'INR',
    });

    const upiUrl = `upi://pay?${upiParams.toString()}`;

    if (navigator.share) {
        navigator.share({
            title: 'Usmania Hair Oil - Advance Payment',
            text: '₹99 ka advance payment karne ke liye apna UPI app chunein:',
            url: upiUrl,
        }).catch(() => {
            alert('Share option cancel hua ya open nahi hua. Kripya QR scan karein ya UPI ID manually use karein: 0952007159@ptyes');
        });
    } else {
        alert('Aapke browser mein share option support nahi hai. Kripya QR scan karein ya UPI ID manually use karein: 0952007159@ptyes');
    }
}
