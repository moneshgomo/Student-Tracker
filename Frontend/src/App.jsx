import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Table, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark'); // Default to dark mode

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Production backend URL - no environment variables needed
      const baseUrl = 'https://student-tracker-backend-7t0t.onrender.com';
      const response = await axios.post(`${baseUrl}/api/marksheet/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while processing the file.");
    } finally {
      setLoading(false);
    }
  };

  const getMessage = (gpa) => {
    if (gpa >= 9.0) return { text: "Outstanding Performance! 🌟", color: "#10B981" };
    if (gpa >= 8.0) return { text: "Excellent Work! 🚀", color: "#3B82F6" };
    if (gpa >= 7.0) return { text: "Good Job! Keep Improving! 👍", color: "#F59E0B" };
    if (gpa >= 6.0) return { text: "Steady Progress! 💪", color: "#F97316" };
    return { text: "Push Harder Next Time! 🔥", color: "#EF4444" };
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="navbar pt-4 px-4 d-flex justify-content-between align-items-center"
      >
        <div className="d-flex align-items-center gap-2">
          <img src="/logo.png" alt="PU Logo" style={{ width: 45, height: 45 }} />
          <span className="fw-bold fs-4 text-gradient">Student Tracker</span>
        </div>

        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          )}
        </button>
      </motion.nav>

      {/* Main Content */}
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-4 py-md-5 px-3 px-md-0">
        <Row className="w-100 justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="glass-card p-5 text-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h1 className="mb-3 text-gradient display-5">Calculate Your GPA</h1>
                      <p className={`mb-3 fs-5 ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`} style={{ opacity: 0.8 }}>
                        Upload your Pondicherry University Result PDF (2023 Regulation) to get instant insights.
                      </p>

                      <div className="d-inline-flex align-items-center px-3 py-1 rounded-pill mb-4" style={{ background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <i className="bi bi-shield-check text-success me-2"></i>
                        <span className="text-success small fw-bold">99.9% Secure & Private - No Data Stored</span>
                      </div>
                    </motion.div>

                    <div className="upload-area mb-4 p-5 d-flex flex-column align-items-center justify-content-center position-relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="position-absolute w-100 h-100 top-0 start-0 opacity-0"
                        style={{ cursor: 'pointer' }}
                      />
                      <div className="mb-3 p-3 rounded-circle" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'dark' ? 'text-white' : 'text-dark'}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                      </div>
                      <h5 className={theme === 'dark' ? 'text-white' : 'text-dark'}>
                        {file ? file.name : "Drag & Drop or Click to Upload"}
                      </h5>
                      <p className="small text-muted mb-0">Supported Format: PDF</p>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>
                      </motion.div>
                    )}

                    <Button
                      className="btn-gradient w-100 py-3 fs-5"
                      onClick={handleSubmit}
                      disabled={loading || !file}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Analyzing Result...
                        </>
                      ) : (
                        'Calculate GPA Now'
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <div className="glass-card p-4 p-md-5">
                    <div className="text-center mb-5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: 120,
                          height: 120,
                          background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          border: `4px solid ${getMessage(result.gpa).color}`
                        }}
                      >
                        <span className="display-4 fw-bold" style={{ color: getMessage(result.gpa).color }}>
                          {result.gpa}
                        </span>
                      </motion.div>
                      <h3 className="fw-bold mb-2" style={{ color: getMessage(result.gpa).color }}>
                        {getMessage(result.gpa).text}
                      </h3>
                      <p className={theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}>
                        {result.studentName} <span className="mx-2">•</span> {result.registerNo}
                      </p>
                    </div>

                    <div className="table-responsive mb-4">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th className="text-center">Credits</th>
                            <th className="text-end">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.subjects.map((sub, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              <td className="fw-medium">{sub.subjectName}</td>
                              <td className="text-center">{sub.credit_hours}</td>
                              <td className={`text-end fw-bold ${sub.grade === 'F' ? 'text-danger' : 'text-success'}`}>
                                {sub.grade}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Button
                      variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
                      className="w-100 py-3 rounded-pill fw-bold"
                      onClick={() => { setResult(null); setFile(null); }}
                    >
                      Calculate Another Result
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Col>
        </Row>


      </Container>
    </div>
  );
}

export default App;
