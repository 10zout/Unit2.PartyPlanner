document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events';
    const partyListContainer = document.getElementById('party-list-container');
    const partyForm = document.getElementById('party-form');

    // Fetch and display all parties
    async function fetchParties() {
        try {
            const response = await fetch(baseUrl);
            const result = await response.json();
            console.log('API response:', result); // Log the response to inspect it
            if (result.success && Array.isArray(result.data)) {
                renderPartyGroups(result.data);
            } else {
                console.error('Unexpected response format:', result);
            }
        } catch (error) {
            console.error('Error fetching parties:', error);
        }
    }

    // Render party groups
    function renderPartyGroups(parties) {
        // Clear existing content
        partyListContainer.innerHTML = '';

        // Group parties by name
        const groupedParties = {};
        parties.forEach(party => {
            if (!groupedParties[party.name]) {
                groupedParties[party.name] = [];
            }
            groupedParties[party.name].push(party);
        });

        // Create and append groups
        for (const groupName in groupedParties) {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('party-group');
            groupDiv.innerHTML = `<h2>${groupName}</h2>`;
            
            const ul = document.createElement('ul');
            groupedParties[groupName].forEach(party => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p><strong>${party.name}</strong></p>
                    <p>${party.description}</p>
                    <p>${new Date(party.date).toLocaleString()}</p>
                    <p>${party.location}</p>
                    <button onclick="deleteParty(${party.id})">Delete</button>
                `;
                ul.appendChild(li);
            });

            groupDiv.appendChild(ul);
            partyListContainer.appendChild(groupDiv);
        }
    }

    // Add a new party
    partyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const date = new Date(document.getElementById('date').value).toISOString(); // Convert date to ISO-8601 format
        const location = document.getElementById('location').value;

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description, date, location })
            });
            const result = await response.json();
            if (result.success) {
                fetchParties(); // Refresh the list to include the new party
                partyForm.reset();
            } else {
                console.error('Error adding party:', result.error);
            }
        } catch (error) {
            console.error('Error adding party:', error);
        }
    });

    // Delete a party
    window.deleteParty = async function(id) { // Attach deleteParty to the window object
        try {
            await fetch(`${baseUrl}/${id}`, {
                method: 'DELETE'
            });
            fetchParties(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    }

    // Initial fetch
    fetchParties();
});
