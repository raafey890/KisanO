// Allowed booking status transitions

const bookingStateMachine = {

    Pending: ['Approved', 'Rejected', 'Cancelled'],

    Approved: ['In Progress'],

    'In Progress': ['Completed'],

    Rejected: [],

    Cancelled: [],

    Completed: []

};

const canTransition = (currentStatus, nextStatus) => {

    const allowed = bookingStateMachine[currentStatus] || [];

    return allowed.includes(nextStatus);

};

module.exports = {

    bookingStateMachine,

    canTransition

};