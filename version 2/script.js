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

function goToSlide(index) {
    currentSlide = index;
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

// Product Showcase Gallery
function changeShowcaseImage(thumbnail, src) {
    const mainImg = document.getElementById('showcase-main-img');
    const thumbnails = document.querySelectorAll('.thumbnail');

    // Update main image with fade effect
    mainImg.style.opacity = '0.7';
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 150);

    // Update active state
    thumbnails.forEach(thumb => thumb.classList.remove('active', 'border-emerald-500'));
    thumbnails.forEach(thumb => thumb.classList.add('border-transparent'));

    thumbnail.classList.add('active', 'border-emerald-500');
    thumbnail.classList.remove('border-transparent');
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

// Scroll-triggered reveal animations (Luxury - slow, elegant reveals)
const revealElements = document.querySelectorAll('[data-reveal]');

if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered reveal for luxury feel
                const delay = entry.target.getAttribute('data-reveal-delay') || (index * 100);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px'
    });

    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });
}

// Header shrink & navigation highlight on scroll (Luxury - subtle blur effect)
const header = document.getElementById('site-header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(document.querySelectorAll('section[id]'));
const headerScrollThreshold = 50;
let scrollTicking = false;

function updateHeaderState() {
    if (!header) return;
    const scrolled = window.scrollY > headerScrollThreshold;
    header.classList.toggle('scrolled', scrolled);

    // Add glass effect on scroll
    if (scrolled) {
        header.style.background = 'rgba(250, 249, 247, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
    } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.borderBottom = 'none';
    }
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

// Make sure the function is globally accessible
window.openUpiPayment = function () {
    const transactionId = 'UHO' + Date.now(); // Unique transaction ID
    const amount = '99';
    const upiId = '9520007159@ptyes';
    const merchantName = 'Usmania Hair Oil';
    const transactionNote = 'Usmania Hair Oil Advance Payment';

    // Build UPI URL with all recommended parameters
    const upiParams = new URLSearchParams({
        pa: upiId,           // Payee VPA
        pn: merchantName,    // Payee Name
        tn: transactionNote, // Transaction Note
        am: amount,          // Amount
        cu: 'INR',           // Currency
        tr: transactionId,   // Transaction Reference ID
        mode: '02',          // Mode: 02 = QR scan, 00 = default
    });

    const upiUrl = `upi://pay?${upiParams.toString()}`;

    // Try opening the UPI URL
    const startTime = Date.now();

    // Create a hidden iframe to try opening the UPI app (better for some devices)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = upiUrl;
    document.body.appendChild(iframe);

    // Also try direct navigation as fallback
    setTimeout(() => {
        window.location.href = upiUrl;
    }, 100);

    // Check if app opened, otherwise show QR modal
    setTimeout(() => {
        // If we're still here after 2 seconds, the app probably didn't open
        // Show QR code modal as fallback
        document.body.removeChild(iframe);

        // Check if page is still visible (app didn't open)
        if (document.visibilityState === 'visible') {
            showQrModal();
        }
    }, 2500);
};

// QR Code Modal for fallback (Luxury styled for V2)
window.showQrModal = function () {
    // Remove existing modal if any
    const existingModal = document.getElementById('qr-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(10,10,10,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(10px);" onclick="closeQrModal(event)">
            <div style="background: #faf9f7; border-radius: 0; padding: 40px; max-width: 380px; width: 100%; text-align: center; position: relative; border: 1px solid rgba(201,169,98,0.3);" onclick="event.stopPropagation()">
                <button onclick="closeQrModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #0a0a0a;">&times;</button>
                
                <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a962; margin-bottom: 10px;">Payment</p>
                <h3 style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400; margin: 0 0 25px 0; color: #0a0a0a;">Scan to Pay</h3>
                
                <img src="assets/qr_code.jpg" alt="QR Code" style="width: 200px; height: 200px; margin: 0 auto 20px; border: 1px solid rgba(201,169,98,0.3);">
                
                <p style="font-family: 'Playfair Display', serif; font-size: 28px; color: #0a0a0a; margin: 15px 0;">₹99</p>
                
                <p style="font-size: 11px; color: #8a8a8a; font-family: monospace; letter-spacing: 0.1em; margin: 20px 0;">
                    UPI: 9520007159@ptyes
                </p>
                
                <div style="display: flex; gap: 12px; margin-top: 25px;">
                    <button onclick="tryGPay()" style="flex: 1; background: #0a0a0a; color: #faf9f7; border: 1px solid #0a0a0a; padding: 14px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s;">
                        GPay
                    </button>
                    <button onclick="tryPhonePe()" style="flex: 1; background: transparent; color: #0a0a0a; border: 1px solid #0a0a0a; padding: 14px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s;">
                        PhonePe
                    </button>
                </div>
                
                <p style="font-size: 10px; color: #8a8a8a; margin-top: 20px; letter-spacing: 0.05em;">
                    If buttons don't work, scan the QR code with your UPI app
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.closeQrModal = function (event) {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.remove();
};

// Try opening specific UPI apps
window.tryGPay = function () {
    const transactionId = 'UHO' + Date.now();
    const upiUrl = `tez://upi/pay?pa=9520007159@ptyes&pn=Usmania%20Hair%20Oil&am=99&cu=INR&tn=Advance%20Payment&tr=${transactionId}`;
    window.location.href = upiUrl;
};

window.tryPhonePe = function () {
    const transactionId = 'UHO' + Date.now();
    const upiUrl = `phonepe://pay?pa=9520007159@ptyes&pn=Usmania%20Hair%20Oil&am=99&cu=INR&tn=Advance%20Payment&tr=${transactionId}`;
    window.location.href = upiUrl;
};
