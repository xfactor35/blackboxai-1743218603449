document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const studentsTable = document.getElementById('students-table');
    
    // Fetch and display student data
    async function fetchStudents() {
        try {
            const response = await fetch('/api/students');
            const students = await response.json();
            
            studentsTable.innerHTML = students.map(student => `
                <tr class="table-row">
                    <td class="px-6 py-4 whitespace-nowrap">${student.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${student.class}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${student.contact}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    // Initial data load
    fetchStudents();
    
    // Event listeners for navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real app, this would load different views
            console.log(`Navigating to: ${this.textContent.trim()}`);
        });
    });
});