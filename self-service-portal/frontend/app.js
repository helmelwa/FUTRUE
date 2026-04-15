document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('permissionForm');
    const statusMessage = document.getElementById('statusMessage');
    const requestStatus = document.getElementById('requestStatus');
    const statusDetails = document.getElementById('statusDetails');
    const submitButton = form.querySelector('.btn-submit');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous messages
        statusMessage.classList.add('hidden');
        statusMessage.classList.remove('success', 'error');
        requestStatus.classList.add('hidden');
        statusDetails.innerHTML = '';

        // Disable submit button during request
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Gather form data
        const requesterName = document.getElementById('requesterName').value.trim();
        const requesterEmail = document.getElementById('requesterEmail').value.trim();
        const resource = document.getElementById('resource').value;
        const justification = document.getElementById('justification').value.trim();
        const timestamp = new Date().toISOString();

        // Build request payload
        const payload = {
            requesterEmail,
            requesterName,
            resource,
            justification,
            timestamp
        };

        try {
            const response = await fetch('https://n8n-production-d20d.up.railway.app/webhook/permission-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Success
                statusMessage.textContent = 'Your permission request has been submitted successfully!';
                statusMessage.classList.remove('error');
                statusMessage.classList.add('success');
                statusMessage.classList.remove('hidden');

                // Show request status
                statusDetails.innerHTML = `
                    <p><span class="label">Name:</span> ${escapeHtml(requesterName)}</p>
                    <p><span class="label">Email:</span> ${escapeHtml(requesterEmail)}</p>
                    <p><span class="label">Resource:</span> ${escapeHtml(resource)}</p>
                    <p><span class="label">Justification:</span> ${escapeHtml(justification)}</p>
                    <p><span class="label">Submitted:</span> ${new Date(timestamp).toLocaleString()}</p>
                `;
                requestStatus.classList.remove('hidden');

                // Reset form
                form.reset();
            } else {
                throw new Error('Server returned status ' + response.status);
            }
        } catch (error) {
            statusMessage.textContent = 'Error: Could not submit request. Please check that the server is running or try again later.';
            statusMessage.classList.remove('success');
            statusMessage.classList.add('error');
            statusMessage.classList.remove('hidden');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Request';
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
