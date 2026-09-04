document.addEventListener("DOMContentLoaded", function () {

    console.log("script.js loaded successfully!");

    const contactForm = document.getElementById("contact-form");

    if (!contactForm) {
        console.error("Contact form not found!");
        return;
    }

    contactForm.addEventListener("submit", async function (event) {

        // Stop page reload
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        try {

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {

                alert("Message sent successfully!");

                // Clear form
                contactForm.reset();

            } else {

                alert(data.message || "Failed to send message.");

            }

        } catch (error) {

            console.error("Error:", error);

            alert(
                "Unable to connect to the server. Please make sure the backend is running."
            );
        }

    });

});