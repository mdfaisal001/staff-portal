import React, { useState, useEffect } from 'react';
import "./Student.css";
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
  DialogContentText,
  Alert
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    dateOfBirth: '', 
    gender: '', 
    parentName: '', 
    parentContact: '', 
    class: '', 
    section: '', 
    rollNumber: '', 
    admissionDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
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
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
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

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedStudent(null);
    setError('');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const studentsRef = collection(firestore, 'students');
      await addDoc(studentsRef, formData);
      await fetchStudents();
      setOpenAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent?.id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const studentRef = doc(firestore, 'students', selectedStudent.id);
      const updateData = { ...formData };
      delete updateData.id;
      
      await updateDoc(studentRef, updateData);
      await fetchStudents();
      setOpenEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent?.id) {
      console.error('No student selected for deletion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const studentRef = doc(firestore, 'students', selectedStudent.id);
      await deleteDoc(studentRef);
      
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== selectedStudent.id)
      );
      
      setOpenDeleteDialog(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student');
      await fetchStudents();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
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
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={() => {
          resetForm();
          setOpenAddModal(true);
        }}
        style={{ marginBottom: '20px', marginLeft: '200px' }}
      >
        Add New Student
      </Button>

      {/* Add Student Modal */}
      <Dialog 
        open={openAddModal} 
        onClose={() => {
          setOpenAddModal(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleAddSubmit}>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {Object.keys(initialFormState).map((field) => (
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
            <Button 
              onClick={() => {
                setOpenAddModal(false);
                resetForm();
              }} 
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              color="primary" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Student Modal */}
      <Dialog 
        open={openViewModal} 
        onClose={() => {
          setOpenViewModal(false);
          setSelectedStudent(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent dividers>
          {selectedStudent && Object.entries(selectedStudent)
            .filter(([key]) => key !== 'id')
            .map(([key, value]) => (
              <Typography key={key} variant="body1" gutterBottom>
                <strong>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </strong> {value}
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenViewModal(false);
              setSelectedStudent(null);
            }} 
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog 
        open={openEditModal} 
        onClose={() => {
          setOpenEditModal(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleEditSubmit}>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {Object.keys(initialFormState).map((field) => (
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
            <Button 
              onClick={() => {
                setOpenEditModal(false);
                resetForm();
              }} 
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              color="primary" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Student'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedStudent(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDeleteDialog(false);
              setSelectedStudent(null);
            }} 
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Students Table */}
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