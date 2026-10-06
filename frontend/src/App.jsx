import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://gupio-zivp.onrender.com/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: ""
  });

  const [editingId, setEditingId] = useState(null);

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      department: "",
      designation: ""
    });

    setEditingId(null);
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.department.trim() ||
      !form.designation.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(
        editingId
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );

      resetForm();
      await fetchEmployees();
      setActivePage("Employees");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend.");
    }
  };

  // EDIT
  const handleEdit = (employee) => {
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation
    });

    setEditingId(employee._id);
    setActivePage("Add Employee");
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete employee");
        return;
      }

      alert("Employee deleted successfully!");

      setSelectedEmployee(null);
      await fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend.");
    }
  };

  // DEPARTMENTS
  const departments = [
    ...new Set(
      employees.map((employee) => employee.department)
    )
  ];

  // FILTER
  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) ||
      employee.email.toLowerCase().includes(searchText);

    const matchesDepartment =
      department === "" ||
      employee.department === department;

    return matchesSearch && matchesDepartment;
  });

  // RECENT EMPLOYEES
  const recentEmployees = [...employees]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">G</div>

          <div>
            <h1>GUPIO</h1>
            <span>HR Management</span>
          </div>
        </div>

        <div className="sidebar-section">

          <span className="sidebar-label">
            MAIN MENU
          </span>

          <button
            className={`nav-item ${
              activePage === "Dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("Dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === "Employees" ? "active" : ""
            }`}
            onClick={() => setActivePage("Employees")}
          >
            <span>♙</span>
            Employees
          </button>

          <button
            className={`nav-item ${
              activePage === "Add Employee" ? "active" : ""
            }`}
            onClick={() => {
              resetForm();
              setActivePage("Add Employee");
            }}
          >
            <span>＋</span>
            Add Employee
          </button>

        </div>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="online-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>All services operational</small>
            </div>
          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              B
            </div>

            <div>
              <strong>Administrator</strong>
              <small>HR Manager</small>
            </div>

          </div>

        </div>

      </aside>

      {/* MAIN AREA */}
      <div className="main-area">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="breadcrumb">
            <span>Workspace</span>
            <b>/</b>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">

            <div className="connection-status">
              <span className="online-dot"></span>
              Backend Connected
            </div>

            <div className="top-avatar">
              B
            </div>

          </div>

        </header>

        <main className="content">

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>

              <section className="welcome-section">

                <div>
                  <p className="eyebrow">
                    OVERVIEW
                  </p>

                  <h2>
                    Good morning, Administrator
                  </h2>

                  <p className="welcome-text">
                    Here's what's happening with your employees today.
                  </p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => {
                    resetForm();
                    setActivePage("Add Employee");
                  }}
                >
                  ＋ Add Employee
                </button>

              </section>

              {/* STATS */}
              <section className="stats-grid">

                <div className="stat-card">

                  <div className="stat-top">

                    <span className="stat-label">
                      TOTAL EMPLOYEES
                    </span>

                    <div className="stat-icon blue">
                      ♙
                    </div>

                  </div>

                  <div className="stat-number">
                    {employees.length}
                  </div>

                  <div className="stat-footer">
                    Active employee records
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-top">

                    <span className="stat-label">
                      DEPARTMENTS
                    </span>

                    <div className="stat-icon purple">
                      ▦
                    </div>

                  </div>

                  <div className="stat-number">
                    {departments.length}
                  </div>

                  <div className="stat-footer">
                    Across organization
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-top">

                    <span className="stat-label">
                      RECENT RECORDS
                    </span>

                    <div className="stat-icon green">
                      ✓
                    </div>

                  </div>

                  <div className="stat-number">
                    {recentEmployees.length}
                  </div>

                  <div className="stat-footer">
                    Latest employees
                  </div>

                </div>

              </section>

              {/* DASHBOARD PANELS */}
              <section className="dashboard-grid">

                <div className="panel">

                  <div className="panel-header">

                    <div>
                      <h3>Recently Added</h3>
                      <p>Latest employee records</p>
                    </div>

                    <button
                      className="text-btn"
                      onClick={() =>
                        setActivePage("Employees")
                      }
                    >
                      View all →
                    </button>

                  </div>

                  {recentEmployees.length === 0 ? (

                    <div className="empty-state">
                      <strong>No employees yet</strong>

                      <p>
                        Add your first employee to get started.
                      </p>
                    </div>

                  ) : (

                    <div className="recent-list">

                      {recentEmployees.map((employee) => (

                        <div
                          className="recent-item"
                          key={employee._id}
                        >

                          <div className="employee-avatar">
                            {employee.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="recent-info">

                            <strong>
                              {employee.name}
                            </strong>

                            <span>
                              {employee.designation}
                            </span>

                          </div>

                          <span className="department-badge">
                            {employee.department}
                          </span>

                          <button
                            className="small-view"
                            onClick={() =>
                              setSelectedEmployee(employee)
                            }
                          >
                            View
                          </button>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

                {/* QUICK ACTIONS */}
                <div className="panel quick-panel">

                  <div className="panel-header">

                    <div>
                      <h3>Quick Actions</h3>
                      <p>Manage your workspace</p>
                    </div>

                  </div>

                  <button
                    className="quick-action"
                    onClick={() => {
                      resetForm();
                      setActivePage("Add Employee");
                    }}
                  >

                    <div className="quick-icon blue">
                      ＋
                    </div>

                    <div>
                      <strong>Add Employee</strong>

                      <span>
                        Create a new employee record
                      </span>
                    </div>

                    <b>→</b>

                  </button>

                  <button
                    className="quick-action"
                    onClick={() =>
                      setActivePage("Employees")
                    }
                  >

                    <div className="quick-icon purple">
                      ♙
                    </div>

                    <div>
                      <strong>View Employees</strong>

                      <span>
                        Manage employee records
                      </span>
                    </div>

                    <b>→</b>

                  </button>

                </div>

              </section>

            </>
          )}

          {/* ADD / EDIT EMPLOYEE */}
          {activePage === "Add Employee" && (

            <section>

              <div className="page-heading">

                <div>

                  <p className="eyebrow">
                    EMPLOYEE MANAGEMENT
                  </p>

                  <h2>
                    {editingId
                      ? "Edit Employee"
                      : "Add Employee"}
                  </h2>

                  <p>
                    {editingId
                      ? "Update employee information below."
                      : "Create a new employee record."}
                  </p>

                </div>

              </div>

              <div className="form-panel">

                <div className="form-panel-header">

                  <div className="form-heading-icon">
                    ＋
                  </div>

                  <div>

                    <h3>
                      Employee Information
                    </h3>

                    <p>
                      Enter the employee's details accurately.
                    </p>

                  </div>

                </div>

                <form onSubmit={handleSubmit}>

                  <div className="form-grid">

                    <div className="input-group">

                      <label>FULL NAME</label>

                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="input-group">

                      <label>EMAIL ADDRESS</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="e.g. rahul@company.com"
                        value={form.email}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="input-group">

                      <label>DEPARTMENT</label>

                      <input
                        type="text"
                        name="department"
                        placeholder="e.g. Engineering"
                        value={form.department}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="input-group">

                      <label>DESIGNATION</label>

                      <input
                        type="text"
                        name="designation"
                        placeholder="e.g. Software Developer"
                        value={form.designation}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                  <div className="form-actions">

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        resetForm();
                        setActivePage("Dashboard");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="primary-btn"
                    >
                      {editingId
                        ? "Update Employee"
                        : "Create Employee"}
                    </button>

                  </div>

                </form>

              </div>

            </section>

          )}

          {/* EMPLOYEES */}
          {activePage === "Employees" && (

            <section>

              <div className="page-heading employee-heading">

                <div>

                  <p className="eyebrow">
                    DIRECTORY
                  </p>

                  <h2>Employees</h2>

                  <p>
                    Manage all employee records in one place.
                  </p>

                </div>

                <button
                  className="primary-btn"
                  onClick={() => {
                    resetForm();
                    setActivePage("Add Employee");
                  }}
                >
                  ＋ Add Employee
                </button>

              </div>

              <div className="panel employee-panel">

                <div className="employee-toolbar">

                  <div>

                    <h3>All Employees</h3>

                    <span>
                      {filteredEmployees.length} records
                    </span>

                  </div>

                  <div className="filters">

                    <div className="search-box">

                      <span>⌕</span>

                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                      />

                    </div>

                    <select
                      value={department}
                      onChange={(e) =>
                        setDepartment(e.target.value)
                      }
                    >

                      <option value="">
                        All Departments
                      </option>

                      {departments.map((dept) => (

                        <option
                          key={dept}
                          value={dept}
                        >
                          {dept}
                        </option>

                      ))}

                    </select>

                  </div>

                </div>

                {loading && (

                  <div className="message">
                    Loading employees...
                  </div>

                )}

                {!loading &&
                  filteredEmployees.length === 0 && (

                    <div className="empty-state">

                      <strong>
                        No employees found
                      </strong>

                      <p>
                        Try changing your search or add a new employee.
                      </p>

                    </div>

                  )}

                {!loading &&
                  filteredEmployees.length > 0 && (

                    <div className="table-wrapper">

                      <table>

                        <thead>

                          <tr>
                            <th>EMPLOYEE</th>
                            <th>EMAIL</th>
                            <th>DEPARTMENT</th>
                            <th>DESIGNATION</th>
                            <th>ACTIONS</th>
                          </tr>

                        </thead>

                        <tbody>

                          {filteredEmployees.map((employee) => (

                            <tr key={employee._id}>

                              <td>

                                <div className="table-name">

                                  <div className="small-avatar">
                                    {employee.name
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <strong>
                                    {employee.name}
                                  </strong>

                                </div>

                              </td>

                              <td>
                                {employee.email}
                              </td>

                              <td>

                                <span className="department-badge">
                                  {employee.department}
                                </span>

                              </td>

                              <td>
                                {employee.designation}
                              </td>

                              <td>

                                <div className="actions">

                                  <button
                                    className="table-action view"
                                    onClick={() =>
                                      setSelectedEmployee(employee)
                                    }
                                  >
                                    View
                                  </button>

                                  <button
                                    className="table-action edit"
                                    onClick={() =>
                                      handleEdit(employee)
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="table-action delete"
                                    onClick={() =>
                                      handleDelete(
                                        employee._id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                    </div>

                  )}

              </div>

            </section>

          )}

        </main>

      </div>

      {/* EMPLOYEE DETAILS MODAL */}
      {selectedEmployee && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedEmployee(null)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedEmployee(null)
              }
            >
              ×
            </button>

            <div className="modal-avatar">
              {selectedEmployee.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <h2>
              {selectedEmployee.name}
            </h2>

            <p className="modal-role">
              {selectedEmployee.designation}
            </p>

            <div className="details">

              <div>
                <span>Email</span>

                <strong>
                  {selectedEmployee.email}
                </strong>
              </div>

              <div>
                <span>Department</span>

                <strong>
                  {selectedEmployee.department}
                </strong>
              </div>

              <div>
                <span>Designation</span>

                <strong>
                  {selectedEmployee.designation}
                </strong>
              </div>

            </div>

            <button
              className="primary-btn full-btn"
              onClick={() => {
                handleEdit(selectedEmployee);
                setSelectedEmployee(null);
              }}
            >
              Edit Employee
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;