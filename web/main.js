import { streamGemini } from './gemini-api.js';

document.addEventListener('DOMContentLoaded', function() {
    let form = document.querySelector('form');
    let promptInput = document.querySelector('input[name="prompt"]');
    let output = document.querySelector('.output');

    // Initialize the Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Event listener for mic icon click
    document.getElementById('micIcon').addEventListener('click', () => {
        recognition.start(); // Start speech recognition when mic icon is clicked
    });

    // Capture the result of the speech recognition
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        promptInput.value = transcript; // Set the recognized text to the input field
        output.textContent = 'Please click generate to see the output.'; // Instruction for the user
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    // Event listener for the form submission
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        output.textContent = 'Generating...';

        try {
            let contents = [
                {
                    type: "text",
                    text: promptInput.value,
                }
            ];

            let stream = streamGemini({
                model: 'gemini-pro',
                contents,
            });

            let buffer = [];
            let md = new markdownit();
            for await (let chunk of stream) {
                buffer.push(chunk);
                output.innerHTML = md.render(buffer.join(''));
            }

            promptInput.value = ""; // Clear input field after processing
        } catch (e) {
            output.innerHTML += '<hr>' + e;
        }
    });

    // Event listener for the Copy button
    document.getElementById('copyButton').addEventListener('click', function() {
        const outputContent = output.innerText;
        navigator.clipboard.writeText(outputContent).then(function() {
            alert('Copied to clipboard');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });

        promptInput.value = ""; // Clear the input field after copying
    });
});
