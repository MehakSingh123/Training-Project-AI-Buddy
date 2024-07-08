document.getElementById('copyButton').addEventListener('click', function() {
  const outputContent = document.querySelector('.output').innerText;
  navigator.clipboard.writeText(outputContent).then(function() {
    alert('Copied to clipboard');
  }, function(err) {
    console.error('Could not copy text: ', err);
  });
});

document.getElementById("theme").addEventListener("click", () => {
  document.body.classList.toggle('dark-theme');
  const mainContainer = document.querySelector('main');
  
  if (document.body.classList.contains('dark-theme')) {
    // Apply dark theme styles
    document.body.style.backgroundColor = "black";
    mainContainer.style.backgroundColor = "#333";
     // Example dark theme color for main container
 
     
  } else {
    // Revert to default styles
    document.body.style.backgroundColor = "white";
    mainContainer.style.backgroundColor = "#f5f5f5";
   
  }
});

