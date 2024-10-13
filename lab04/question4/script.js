const maxChars = 250;

    function updateCounter() {
        const textarea = document.getElementById('message');
        const counter = document.getElementById('charCounter');
        const charCount = textarea.value.length;

        counter.textContent = `${charCount} / ${maxChars}`;

        // Change border color when limit is reached
        if (charCount >= maxChars) {
            textarea.classList.add('warning');
            counter.classList.add('char-limit');
        } else {
            textarea.classList.remove('warning');
            counter.classList.remove('char-limit');
        }
    }