import React, { useState, useEffect } from 'react';
import "./Student.css"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Button, 
  Dialog, 
  TextField, 
  Typography,
  Paper,
  Container,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Add confirmation dialog
  DialogContentText
} from '@mui/material';
import { 
  collection, 
  addDoc, 
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { 
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // Add delete confirmation dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', 
    dateOfBirth: '', gender: '', parentName: '', 
    parentContact: '', class: '', section: '', 
    rollNumber: '', admissionDate: '',
  });

  const fetchStudents = async () => {
    try {
      const studentsRef = collection(firestore, 'students');
      const snapshot = await getDocs(studentsRef);
      const studentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentsRef = collection(firestore, 'students');
      await addDoc(studentsRef, formData);
      await fetchStudents();
      setOpenAddModal(false);
      setFormData({
        name: '', email: '', phone: '', address: '', 
        dateOfBirth: '', gender: '', parentName: '', 
        parentContact: '', class: '', section: '', 
        rollNumber: '', admissionDate: '',
      });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent?.id) {
      console.error('No student selected for editing');
      return;
    }
    
    try {
      const studentRef = doc(firestore, 'students', selectedStudent.id);
      // Remove the id field from formData before updating
      const { id, ...updateData } = formData;
      await updateDoc(studentRef, updateData);
      await fetchStudents();
      setOpenEditModal(false);
      setSelectedStudent(null);
      setFormData({
        name: '', email: '', phone: '', address: '', 
        dateOfBirth: '', gender: '', parentName: '', 
        parentContact: '', class: '', section: '', 
        rollNumber: '', admissionDate: '',
      });
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  // Modified delete handling with confirmation
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete?.id) return;
    
    try {
      const studentRef = doc(firestore, 'students', studentToDelete.id);
      await deleteDoc(studentRef);
      await fetchStudents();
      setOpenDeleteDialog(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setOpenViewModal(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData(student);
    setOpenEditModal(true);
  };

  return (
    <Container className='grid'>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ marginLeft: 18 }}
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
        style={{ marginBottom: '20px' }}
      >
        Add New Student
      </Button>

      {/* Add Student Modal */}
      <Dialog 
        open={openAddModal} 
        onClose={() => setOpenAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className='addBtn'>Add New Student</DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {Object.keys(formData).map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    name={field}
                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    fullWidth
                    variant="outlined"
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)} color="secondary">
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Student Modal */}
      <Dialog 
        open={openViewModal} 
        onClose={() => setOpenViewModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent dividers>
          {selectedStudent && Object.entries(selectedStudent)
            .filter(([key]) => key !== 'id') // Exclude id field from display
            .map(([key, value]) => (
              <Typography key={key} variant="body1" gutterBottom>
                <strong>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </strong> {value}
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Student</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {Object.keys(formData)
                .filter(key => key !== 'id') // Exclude id field from form
                .map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      name={field}
                      label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      fullWidth
                      variant="outlined"
                      value={formData[field] || ''}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)} color="secondary">
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              variant="contained"
            >
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Students Table or Empty State */}
      {students.length === 0 ? (
        <Paper 
          elevation={3} 
          style={{ 
            padding: '40px', 
            textAlign: 'center', 
            marginTop: '20px' 
          }}
        >
          <Typography variant="h5" color="textSecondary">
            No Students Found
          </Typography>
          <Typography variant="body1" color="textSecondary" style={{ marginTop: '10px' }}>
            Click "Add New Student" to get started
          </Typography>
        </Paper>
      ) : (
        <Table className='table1'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleView(student)}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<ViewIcon />}
                    style={{ marginRight: '5px' }}
                  >
                    View
                  </Button>
                  <Button 
                    onClick={() => handleEdit(student)}
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<EditIcon />}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDeleteClick(student)}
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}