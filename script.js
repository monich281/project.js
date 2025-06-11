// Student Management System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let currentLanguage = 'en';
    let currentId = localStorage.getItem('currentId') || 1;
    let currentStudent = null;
    
    // DOM Elements
    const studentForm = document.getElementById('studentForm');
    const saveBtn = document.getElementById('saveBtn');
    const updateBtn = document.getElementById('updateBtn');
    let deleteBtn = document.getElementById('deleteBtn');
    const studentTable = document.getElementById('studentTable').querySelector('tbody');
    const searchInput = document.getElementById('searchInput');
    const studentSearchInput = document.getElementById('studentSearchInput');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const adminLink = document.querySelector('a[href="#admin"]');
    const adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    
    // Language switcher removed since only English is supported
    
    // Admin Modal
    adminLink.addEventListener('click', function(e) {
        e.preventDefault();
        adminModal.show();
    });
    
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        // Simple authentication (in real app, this should be server-side)
        if (username === 'admin' && password === 'password') {
            adminModal.hide();
            alert('Admin login successful!');
        } else {
            loginError.classList.remove('d-none');
        }
    });
    
    // Back to Top Button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Student Form Submission
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const program = document.getElementById('program').value;
        const enrollmentDate = document.getElementById('enrollmentDate').value;
        
        // Add new student
        if (!currentStudent) {
            const newStudent = {
                id: currentId++,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                program: program,
                enrollmentDate: enrollmentDate
            };
            
            students.push(newStudent);
            localStorage.setItem('currentId', currentId);
        } 
        // Update existing student
        else {
            const index = students.findIndex(student => student.id === currentStudent.id);
            if (index !== -1) {
                students[index] = {
                    ...currentStudent,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    program: program,
                    enrollmentDate: enrollmentDate
                };
            }
            currentStudent = null;
        }
        
        saveStudents();
        studentForm.reset();
        displayStudents();
        
        // Show success message
        showAlert('Student saved successfully!', 'success');
    });
    
    // Update Student
    updateBtn.addEventListener('click', function() {
        const studentId = document.getElementById('studentId').value;
        if (!studentId) {
            showAlert('Please select a student to update', 'danger');
            return;
        }
        
        studentForm.dispatchEvent(new Event('submit'));
    });
    
    // Delete Student
    deleteBtn.addEventListener('click', function() {
        const studentId = document.getElementById('studentId').value;
        if (!studentId) {
            showAlert('Please select a student to delete', 'danger');
            return;
        }
        
        if (confirm('Are you sure you want to delete this student?')) {
            students = students.filter(student => student.id !== parseInt(studentId));
            saveStudents();
            studentForm.reset();
            document.getElementById('studentId').value = '';
            currentStudent = null;
            displayStudents();
            showAlert('Student deleted successfully!', 'success');
        }
    });
    
    // Search Functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchWebsite(searchTerm);
    });
    
    studentSearchInput.addEventListener('input', function() {
        displayStudents(this.value.toLowerCase());
    });
    
    // Display students in table
    function displayStudents(searchTerm = '') {
        studentTable.innerHTML = '';
        
        const filteredStudents = students.filter(student => {
            if (!searchTerm) return true;
            
            return (
                student.firstName.toLowerCase().includes(searchTerm) ||
                student.lastName.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm) ||
                student.phone.includes(searchTerm) ||
                getProgramName(student.program).toLowerCase().includes(searchTerm)
            );
        });
        
        filteredStudents.forEach(student => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${getProgramName(student.program)}</td>
                <td>
                    <button class="btn btn-sm btn-info edit-btn" data-id="${student.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </td>
            `;
            
            studentTable.appendChild(tr);
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editStudent(id);
            });
        });
    }
    
    // Edit student
    function editStudent(id) {
        const student = students.find(student => student.id === id);
        if (student) {
            document.getElementById('studentId').value = student.id;
            document.getElementById('firstName').value = student.firstName;
            document.getElementById('lastName').value = student.lastName;
            document.getElementById('email').value = student.email;
            document.getElementById('phone').value = student.phone;
            document.getElementById('program').value = student.program;
            document.getElementById('enrollmentDate').value = student.enrollmentDate;
            
            currentStudent = student;
            
            // Scroll to form
            document.getElementById('studentForm').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Save students to localStorage
    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    // Get program name based on value (only English now)
    function getProgramName(program) {
        switch (program) {
            case 'business': return 'Business Administration';
            case 'it': return 'Information Technology';
            case 'engineering': return 'Engineering';
            default: return program;
        }
    }
    
    // Search website function
    function searchWebsite(term) {
        if (!term) return;
        
        // Simulate website search
        const sections = document.querySelectorAll('section');
        let found = false;
        
        sections.forEach(section => {
            const text = section.innerText.toLowerCase();
            if (text.includes(term)) {
                section.scrollIntoView({ behavior: 'smooth' });
                found = true;
                return;
            }
        });
        
        if (!found) {
            alert('No results found for: ' + term);
        }
    }
    
    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('#students .container');
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
    
    // Initialize the page
    displayStudents();
    
    // Add sample student data if empty
    if (students.length === 0) {
        // Sample data in English
        students = [
            {
                id: 1,
                firstName: 'Sopheak',
                lastName: 'Meas',
                email: 'sopheak.meas@example.com',
                phone: '012 345 678',
                program: 'business',
                enrollmentDate: '2025-01-15'
            },
            {
                id: 2,
                firstName: 'Dara',
                lastName: 'Sok',
                email: 'dara.sok@example.com',
                phone: '098 765 432',
                program: 'it',
                enrollmentDate: '2025-02-20'
            },
            {
                id: 3,
                firstName: 'Bopha',
                lastName: 'Tep',
                email: 'bopha.tep@example.com',
                phone: '077 889 900',
                program: 'engineering',
                enrollmentDate: '2025-03-10'
            }
        ];
        currentId = 4;
        saveStudents();
        localStorage.setItem('currentId', currentId);
        displayStudents();
    }
});
