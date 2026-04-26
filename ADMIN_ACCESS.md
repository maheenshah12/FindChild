# Admin Access

## Testing Password

For testing purposes, use this password to update case status:

**Password:** `admin123`

## How It Works

1. When viewing a case detail page
2. Click "Mark as Resolved" or "Mark as Investigating"
3. Enter password: `admin123`
4. Case status will be updated

## Security Note

This is a **simple password for testing only**. 

For production, you should:
- Implement proper authentication (login system)
- Use role-based access control (Admin, Parent, Viewer)
- Store passwords securely (hashed)
- Add user tracking

## Upgrading to Full Authentication

When ready for production, we can implement:
- User registration/login
- JWT tokens
- Role-based permissions
- Password reset
- Session management

For now, this password protection is sufficient for testing and demos.
