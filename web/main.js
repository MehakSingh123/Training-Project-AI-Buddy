import { streamGemini } from './gemini-api.js';

document.addEventListener('DOMContentLoaded', function() {
  let form = document.querySelector('form');
  let promptInput = document.querySelector('input[name="prompt"]');
  let output = document.querySelector('.output');

  // Event listener for the form submission
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    output.textContent = 'Generating...';

    try {
      // Assemble the prompt by combining the text with the chosen image
      let contents = [
        {
          type: "text",
          text: promptInput.value,
        }
      ];

      // Call the gemini-pro-vision model, and get a stream of results
      let stream = streamGemini({
        model: 'gemini-pro',
        contents,
      });

      // Read from the stream and interpret the output as markdown
      let buffer = [];
      let md = new markdownit();
      for await (let chunk of stream) {
        buffer.push(chunk);
        output.innerHTML = md.render(buffer.join(''));
      }

      // Clear the input field after processing
      promptInput.value = "";
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

    // Clear the input field after copying
    promptInput.value = "";
  });
});
