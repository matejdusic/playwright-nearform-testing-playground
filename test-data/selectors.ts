export const loginSelectors = {
    username: 'Username',
    password: 'Password',
    loginButton: 'login-button',
    logoutButton: 'logout-button',
    successMessage: '.MuiAlert-message',
    errorMessage: 'error-invalid-credentials'
};

export const checkboxSelectors = {
    // Basic checkboxes
    checked: 'checked',
    disabled: 'disabled',
    required: 'required',
    requiredMessage: 'required-message',
    
    // Feature checkboxes
    favorite: 'favorite',
    bookmark: 'bookmark',
    
    // Parent-child checkboxes
    parent: 'parent',
    child: 'child'
};

export const dynamicTableSelectors = {
    table: 'dynamic-table',
    addRowButton: 'add-row-button',
    deleteRowButton: 'delete-row-button'
};
