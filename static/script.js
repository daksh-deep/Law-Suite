// Initialize Locomotive Scroll
// const scroll = new LocomotiveScroll({
//     el: document.querySelector("#main"),
//     smooth: true,
//   });

// Prevent default context menu
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


// -- scroll-to-top button --
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopButton = document.getElementById('scroll-to-top-btn');

    // Show or hide the button based on scroll position
    scroll.on('scroll', (args) => {
        if (args.scroll.y > 300) {
            scrollToTopButton.classList.remove('hide');
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
            scrollToTopButton.classList.add('hide');
        }
    });
    scrollToTopButton.addEventListener('click', () => {
        scroll.scrollTo('#nav');
    });
});


// Resize Page 3 Text Area
function resizeTextarea() {
    const textarea = document.getElementById('prompt-textarea');

    textarea.style.height = 'auto'; 
    textarea.style.height = textarea.scrollHeight + 'px'; 

    if (textarea.value.trim() === '') {
        textarea.style.height = '20px';
    }
}


// Function to break text
function breakText() {
    var heading = document.querySelector("#page1-heading");
    var clutter = "";
    var splittedText = ['L', 'A', 'W', ' ', 'S', 'U', 'I', 'T', 'E'];

    splittedText.forEach(function (elem, index) {
        if (elem === ' ') {
            clutter += ' ';
        } else if (elem === 'S') {
            clutter += `<span id="inside-span" style="color: #37d151;">${elem}`;
        } else if (elem === 'E') {
            clutter += `${elem}</span>`;
        } else {
            clutter += `<span id="inside-span">${elem}</span>`;
        }
    });

    heading.innerHTML = clutter;
}


// Animator Function
function callAnimation(loader, nav) {
    var animationPlayed = localStorage.getItem('animationPlayed');
    var expiration = localStorage.getItem('animationExpiration');

    if (!animationPlayed || (expiration && Date.now() > parseInt(expiration))) {
        var tlLoader = gsap.timeline();
        var tlNav = gsap.timeline();

        // Loader timeline
        if (loader === true) {
            document.getElementById("loader").style.zIndex = 9;
            tlLoader.to("#loader-start-text", { opacity: 1, duration: 1.5, ease: "sine.in" })
                .to("#loader-start-text", { opacity: 0, duration: 2, delay: 1, ease: "power2.out" })
                .to("#loader-mid-text", { opacity: 1, duration: 1.5, ease: "sine.in" })
                .to("#loader-mid-text", { opacity: 0, duration: 2, delay: 1, ease: "power2.out" })
                .to("#loader-end-text", { opacity: 1, duration: 1.5, ease: "power2.in" })
                .to("#loader", {
                    top: "-100%", delay: 2, duration: 2, ease: "expo.out",
                });
        }

        // LocalStorage interaction
        localStorage.setItem('animationPlayed', true);

        // -- Local Storage Expiry --
        var expirationTime = Date.now() + (30 * 60 * 1000); // 30 minutes
        localStorage.setItem('animationExpiration', expirationTime);
    }

    // Navigation timeline
    if (nav === true) {
        var tlNav = gsap.timeline();
        breakText();
        tlNav.from("#page1-heading #inside-span", { 
            y: 70, 
            opacity: 0, 
            duration: 0.8, 
            stagger: 0.15,
            onComplete: function() {
                let trans = { value: 0 };
                gsap.to(trans, {
                    value: 1,
                    duration: 1,
                    ease: "sine.inOut",
                });
            }
        })
        .to("nav", {
            display: "block", 
            opacity: 1, 
            duration: 0.5, 
            ease: "power2.inOut", 
            stagger: 1,
        }, 0);
        
        tlNav.to("#loader-video", {
            opacity: 0,
            duration:0.5,
            ease: "power2.out",
        })

    }

    // Master timeline
    var masterTl = gsap.timeline();
    if (loader === true) {
        masterTl.add(tlLoader);
    }

    if (nav === true) {
        masterTl.add(tlNav, "+=0");
    }
}


// -- Mannual Local Storage Expire Setting --
function expireAnimationStorage(manualExpire) {
    if (manualExpire === true) {
        localStorage.removeItem('animationPlayed');
        localStorage.removeItem('animationExpiration');
        console.log('Animation storage expired manually.');
    } else {
        console.log('Animation storage not expired.');
    }
}

// Call the functions
breakText();
expireAnimationStorage(false);
callAnimation(true, true);


// AJAX Calls 
$(document).ready(function() {
    var textarea = $('#prompt-textarea');
    var resultContainer = $('#result-container');
    
    // Function to validate the textarea
    function validateTextarea() {
        // No additional changes needed here for your requirements
    }

    // Event listener for textarea input
    textarea.on('input', function() {
        // No additional changes needed here for your requirements
    });

    // Form submission
    $('#predict-form').on('submit', function(event) {
        event.preventDefault();
        if (textarea.val().trim() === '') {
            // Prevent form submission if textarea is empty
            event.preventDefault(); // Prevent form submission
            
            // Display the message in the result container
            resultContainer.html('<h1 class="text-red-400 text-center">Please enter a prompt and try again.</h1>');
            return;
        }

        // Proceed with AJAX request if textarea has content
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: $(this).serialize(),
            success: function(response) {
                var results = response.results;

                if (results.length === 0 || results.every(result => result['Predicted BNS'] === null)) {
                    // If all Predicted BNS are null
                    resultContainer.html('<h1 class="text-red-400 text-center">The predictions are currently uncertain. To enhance accuracy, please consider revising your input to include more specific legal terminology.</h1>');
                } else {
                    var tableHtml = '<table class="result-table"><thead><tr><th>Predicted BNS</th><th>Act</th></tr></thead><tbody>';

                    results.forEach(function(result) {
                        tableHtml += '<tr><td>' + (result['Predicted BNS'] || 'N/A') + '</td><td>' + result['Act'] + '</td></tr>';
                    });

                    tableHtml += '</tbody></table>';

                    resultContainer.html(tableHtml);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                if(error = "The site is under maintenance. Please try again later."){
                    resultContainer.html('<p class="text-center text-red-400">The site is under maintenance. Please try again later.</p>');
                } else {
                    resultContainer.html('<p class="text-center text-red-400">There was an error processing your request.</p>');
                }
            }
        });
    });
});



