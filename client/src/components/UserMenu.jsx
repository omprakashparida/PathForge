import { useState } from 'react';
import { createPortal } from 'react-dom';
import api, { logout } from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Avatar button + dropdown. Used in the rail footer (desktop) and the
// mobile top bar. Carries the account actions that used to live in Navbar.
function UserMenu({ name, dropUp = true, compact = false }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const response = await api.delete('/api/profile/delete', { data: { password } });
      toast.success(response.data.message);
      logout();
      navigate('/signup');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button className="rail-user" onClick={() => setOpen((v) => !v)} style={compact ? { width: 'auto', padding: 4 } : undefined}>
        <span className="rail-avatar">{name?.charAt(0)?.toUpperCase() || '?'}</span>
        {!compact && (
          <span style={{ minWidth: 0 }}>
            <span className="nm" style={{ display: 'block' }}>{name || 'Learner'}</span>
            <span className="rl" style={{ display: 'block' }}>Account</span>
          </span>
        )}
      </button>

      {open && (
        <>
          {createPortal(
            <div className="menu-backdrop" onClick={() => setOpen(false)} />,
            document.body
          )}
          <div className={`menu-pop${dropUp ? '' : ' up'}`}>
            <button
              className="menu-item"
              onClick={() => { setOpen(false); navigate('/profile'); }}
            >
              <span>👤</span> Edit Profile
            </button>
            <button
              className="menu-item danger"
              onClick={() => { setOpen(false); setShowDeleteModal(true); }}
            >
              <span>🗑</span> Delete Account
            </button>
            <button className="menu-item" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </>
      )}

      {showDeleteModal && createPortal(
        <div className="modal-back" onClick={() => { setShowDeleteModal(false); setPassword(''); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="serif" style={{ fontSize: 24, margin: '0 0 8px', color: 'var(--bad)' }}>
              Delete Account
            </h2>
            <p className="small" style={{ margin: '0 0 18px', lineHeight: 1.6 }}>
              This action is <strong style={{ color: 'var(--bad)' }}>permanent</strong> and
              cannot be undone. Enter your password to confirm.
            </p>
            <div className="field">
              <input
                type="password"
                className="input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="row">
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => { setShowDeleteModal(false); setPassword(''); }}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{ flex: 1, background: 'var(--bad)', color: '#fff' }}
                disabled={deleting || !password}
                onClick={handleDeleteAccount}
              >
                {deleting ? <span className="spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default UserMenu;
