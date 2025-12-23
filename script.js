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
    geminiResponseDiv.innerHTML = ''; // Clear structured content
    generatePlanBtn.disabled = true;
    generatePlanBtn.textContent = 'Aapka plan taiyar ho raha hai...';

    // Simulate slight delay for "AI" feel (optional, can be removed if instant is preferred)
    setTimeout(() => {
        const planText = hairPlans[hairType]?.[hairConcern];

        if (planText) {
            // Format the plain text into HTML
            let formattedHtml = '<div class="space-y-4">';

            const lines = planText.split('\n');
            let inList = false;

            lines.forEach(line => {
                line = line.trim();
                if (!line) return;

                if (line.includes('Weekly Plan:')) {
                    formattedHtml += `<h3 class="text-lg md:text-xl font-bold text-emerald-800 mb-2 border-b border-emerald-200 pb-2">${line}</h3>`;
                }
                else if (line.startsWith('-')) {
                    if (!inList) {
                        formattedHtml += '<ul class="list-disc pl-4 md:pl-5 space-y-1 text-gray-700 text-sm md:text-base">';
                        inList = true;
                    }
                    formattedHtml += `<li>${line.substring(1).trim()}</li>`;
                }
                else if (line.includes('Tip:')) {
                    if (inList) {
                        formattedHtml += '</ul>';
                        inList = false;
                    }
                    const [label, content] = line.split(':');
                    formattedHtml += `<div class="bg-emerald-100/50 p-3 rounded-lg border-l-4 border-emerald-500 text-sm md:text-base">
                        <span class="font-bold text-emerald-800">${label}:</span> <span class="text-gray-700">${content}</span>
                    </div>`;
                }
                else {
                    if (inList) {
                        formattedHtml += '</ul>';
                        inList = false;
                    }
                    // Handle "Usmania Oil ka istemal" or other paragraphs
                    if (line.includes('Usmania Oil ka istemal')) {
                        const [label, content] = line.split(':');
                        formattedHtml += `<p class="font-medium text-gray-800 text-sm md:text-base"><span class="font-bold text-emerald-700">${label}:</span> ${content}</p>`;
                    } else {
                        formattedHtml += `<p class="text-gray-700 text-sm md:text-base">${line}</p>`;
                    }
                }
            });

            if (inList) formattedHtml += '</ul>';
            formattedHtml += '</div>';

            geminiResponseDiv.innerHTML = formattedHtml;
        } else {
            geminiResponseDiv.innerHTML = '<p class="text-red-500 font-medium">Maaf kijiye, aapke liye plan nahi mila. Kripya contact karein.</p>';
        }

        // Hide loader and show response
        loader.classList.add('hidden');
        geminiResponseDiv.classList.remove('hidden');
        generatePlanBtn.disabled = false;
        generatePlanBtn.innerHTML = '✨ Mera Plan Banayein';

    }, 800); // 800ms delay for better UX
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

// QR Code Modal for fallback
window.showQrModal = function () {
    // Remove existing modal if any
    const existingModal = document.getElementById('qr-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="closeQrModal(event)">
            <div style="background: white; border-radius: 20px; padding: 30px; max-width: 360px; width: 100%; text-align: center; position: relative;" onclick="event.stopPropagation()">
                <button onclick="closeQrModal()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
                
                <div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="font-size: 18px; font-weight: bold; margin: 0;">Scan QR Code to Pay</h3>
                    <p style="font-size: 14px; opacity: 0.9; margin: 5px 0 0 0;">Use any UPI app</p>
                </div>
                
                <img src="assets/qr_code.jpg" alt="QR Code" style="width: 220px; height: 220px; margin: 0 auto 15px; border-radius: 12px; border: 3px solid #059669;">
                
                <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 10px 0;">₹99</p>
                
                <p style="font-size: 12px; color: #666; font-family: monospace; background: #f3f4f6; padding: 8px; border-radius: 8px; margin: 15px 0;">
                    UPI: 9520007159@ptyes
                </p>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="tryGPay()" style="flex: 1; background: #4285f4; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">
                        Try GPay
                    </button>
                    <button onclick="tryPhonePe()" style="flex: 1; background: #5f259f; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">
                        Try PhonePe
                    </button>
                </div>
                
                <p style="font-size: 11px; color: #999; margin-top: 15px;">
                    If buttons don't work, please scan the QR code above with your UPI app
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
