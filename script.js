// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Gemini AI Feature Script
const generatePlanBtn = document.getElementById('generate-plan-btn');
const loader = document.getElementById('loader');
const geminiResponseDiv = document.getElementById('gemini-response');

generatePlanBtn.addEventListener('click', async () => {
    const hairType = document.getElementById('hair-type').value;
    const hairConcern = document.getElementById('hair-concern').value;

    // Show loader and hide previous response
    loader.classList.remove('hidden');
    geminiResponseDiv.classList.add('hidden');
    geminiResponseDiv.textContent = '';
    generatePlanBtn.disabled = true;
    generatePlanBtn.textContent = 'Aapka plan taiyar ho raha hai...';
    
    const userQuery = `Mera hair type ${hairType} hai aur meri sabse badi problem ${hairConcern} hai.`;

    const systemPrompt = `Aap ek Ayurvedic hair care expert hain. User ke liye ek personalized hair care plan banayein. User ki details hain: Hair Type: ${hairType}, Main Concern: ${hairConcern}. Ek simple, weekly hair care routine Hinglish (Hindi + English) mein banayein. Is routine mein 'Usmania Hair Oil' ka istemal prominent hona chahiye aur use unki problem ke liye kaise istemal karna hai, yeh samjhayein. Saath mein ek diet tip aur ek lifestyle tip bhi dein. Jawaab ko friendly, aasan bhasha mein rakhein, aur headings ka istemal karke structure karein (jaise 'Aapka Weekly Plan:', 'Usmania Oil ka istemal:', 'Khan-paan Tip:', 'Lifestyle Tip:'). Response ko 200 shabdon se kam rakhein.`;

    const apiKey = ""; // API key is handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            geminiResponseDiv.textContent = candidate.content.parts[0].text;
        } else {
             geminiResponseDiv.textContent = 'Maaf kijiye, abhi hum aapka plan nahi bana pa rahe hain. Kripya thodi der baad koshish karein.';
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        geminiResponseDiv.textContent = 'Koi takneeki samasya aa gayi hai. Kripya thodi der baad koshish karein.';
    } finally {
        // Hide loader and show response
        loader.classList.add('hidden');
        geminiResponseDiv.classList.remove('hidden');
        generatePlanBtn.disabled = false;
        generatePlanBtn.innerHTML = '✨ Mera Plan Banayein';
    }
});
