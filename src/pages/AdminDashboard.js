import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        dateRange: 'today',
        userId: ''
    });
    const [selectedJob, setSelectedJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
        // Poll for updates every 30 seconds
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, [filters]);

    const loadDashboardData = async () => {
        try {
            // Load jobs with filters
            const queryParams = new URLSearchParams({
                status: filters.status,
                dateRange: filters.dateRange,
                userId: filters.userId
            });
            
            const [jobsResponse, metricsResponse] = await Promise.all([
                fetch(`/api/admin/jobs?${queryParams}`),
                fetch('/api/admin/metrics')
            ]);

            if (!jobsResponse.ok || !metricsResponse.ok) {
                throw new Error('Failed to load dashboard data');
            }

            const [jobsData, metricsData] = await Promise.all([
                jobsResponse.json(),
                metricsResponse.json()
            ]);

            setJobs(jobsData.jobs);
            setMetrics(metricsData);
            setError(null);
        } catch (error) {
            console.error('Dashboard error:', error);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetryJob = async (jobId) => {
        try {
            const response = await fetch(`/api/admin/jobs/${jobId}/retry`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to retry job');
            }

            // Refresh job list
            loadDashboardData();
        } catch (error) {
            console.error('Retry error:', error);
            alert('Failed to retry job');
        }
    };

    const handleCancelJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to cancel this job?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/jobs/${jobId}/cancel`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to cancel job');
            }

            // Refresh job list
            loadDashboardData();
        } catch (error) {
            console.error('Cancel error:', error);
            alert('Failed to cancel job');
        }
    };

    const handleViewLogs = async (jobId) => {
        try {
            const response = await fetch(`/api/admin/jobs/${jobId}/logs`);
            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }
            const data = await response.json();
            setSelectedJob({ ...jobs.find(j => j.job_id === jobId), logs: data.logs });
        } catch (error) {
            console.error('Logs error:', error);
            alert('Failed to fetch job logs');
        }
    };

    const formatDuration = (ms) => {
        if (!ms) return 'N/A';
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="refresh-button">
                    <button
                        className="btn btn-outline"
                        onClick={loadDashboardData}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Refreshing...' : '🔄 Refresh'}
                    </button>
                </div>
            </div>

            {/* Metrics Panel */}
            {metrics && (
                <div className="metrics-panel">
                    <div className="metric-card">
                        <h3>Queue Length</h3>
                        <div className="metric-value">{metrics.queueLength}</div>
                        <div className="metric-label">active jobs</div>
                    </div>
                    <div className="metric-card">
                        <h3>Processing Time</h3>
                        <div className="metric-value">
                            {formatDuration(metrics.avgProcessingTime)}
                        </div>
                        <div className="metric-label">average</div>
                    </div>
                    <div className="metric-card">
                        <h3>Failure Rate</h3>
                        <div className="metric-value">{metrics.failuresPerHour}</div>
                        <div className="metric-label">per hour</div>
                    </div>
                    <div className="metric-card">
                        <h3>Success Rate</h3>
                        <div className="metric-value">
                            {metrics.successRate}%
                        </div>
                        <div className="metric-label">last 24h</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="filters-panel">
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="queued">Queued</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Date Range</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>User ID/Email</label>
                    <input
                        type="text"
                        value={filters.userId}
                        onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                        placeholder="Search by user..."
                    />
                </div>
            </div>

            {/* Jobs Table */}
            <div className="jobs-table-container">
                <table className="jobs-table">
                    <thead>
                        <tr>
                            <th>Job ID</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Style</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.job_id} className={`status-${job.status}`}>
                                <td>{job.job_id}</td>
                                <td>
                                    <div className="user-cell">
                                        <span className="user-email">{job.user.email}</span>
                                        <span className="user-id">ID: {job.user.id}</span>
                                    </div>
                                </td>
                                <td>{job.productName}</td>
                                <td>{job.style}</td>
                                <td>
                                    <span className={`status-badge ${job.status}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="timestamp-cell">
                                        <span className="date">
                                            {new Date(job.submitted_at).toLocaleDateString()}
                                        </span>
                                        <span className="time">
                                            {new Date(job.submitted_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </td>
                                <td>{formatDuration(job.time_taken)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-small"
                                            onClick={() => handleViewLogs(job.job_id)}
                                        >
                                            Logs
                                        </button>
                                        {job.status === 'failed' && (
                                            <button
                                                className="btn btn-small btn-primary"
                                                onClick={() => handleRetryJob(job.job_id)}
                                            >
                                                Retry
                                            </button>
                                        )}
                                        {['queued', 'processing'].includes(job.status) && (
                                            <button
                                                className="btn btn-small btn-danger"
                                                onClick={() => handleCancelJob(job.job_id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Job Logs Modal */}
            {selectedJob && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Job Logs: {selectedJob.job_id}</h2>
                            <button
                                className="close-button"
                                onClick={() => setSelectedJob(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="job-info">
                                <div className="info-group">
                                    <label>Status:</label>
                                    <span className={`status-badge ${selectedJob.status}`}>
                                        {selectedJob.status}
                                    </span>
                                </div>
                                <div className="info-group">
                                    <label>User:</label>
                                    <span>{selectedJob.user.email}</span>
                                </div>
                                <div className="info-group">
                                    <label>Submitted:</label>
                                    <span>
                                        {new Date(selectedJob.submitted_at).toLocaleString()}
                                    </span>
                                </div>
                                <div className="info-group">
                                    <label>Duration:</label>
                                    <span>{formatDuration(selectedJob.time_taken)}</span>
                                </div>
                            </div>
                            <div className="logs-container">
                                {selectedJob.logs.map((log, index) => (
                                    <div
                                        key={index}
                                        className={`log-entry ${log.level}`}
                                    >
                                        <span className="log-timestamp">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span className="log-level">{log.level}</span>
                                        <span className="log-message">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            {selectedJob.status === 'failed' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleRetryJob(selectedJob.job_id);
                                        setSelectedJob(null);
                                    }}
                                >
                                    Retry Job
                                </button>
                            )}
                            <button
                                className="btn btn-secondary"
                                onClick={() => setSelectedJob(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
